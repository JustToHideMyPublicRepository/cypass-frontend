<template>
  <UiBaseCard class="overflow-hidden p-0 border-none shadow-xl shadow-ash/20">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="text-[10px] text-hsa uppercase bg-ash/30 border-b border-ash font-bold tracking-[0.2em]">
          <tr>
            <th class="px-6 py-4">Fichier</th>
            <th class="px-6 py-4 text-center">{{ isArchive ? 'Archivage' : 'Émission' }}</th>
            <th class="px-6 py-4">Digital Signature (Hash)</th>
            <th class="px-6 py-4 text-center">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ash/50">
          <!-- Loading State -->
          <MeDocsentryHomeListLoading v-if="loading" />

          <!-- Empty State -->
          <MeDocsentryHomeListEmpty v-else-if="documents.length === 0" />

          <!-- Data State -->
          <tr v-else v-for="doc in documents" :key="doc.id" @contextmenu.prevent="handleContextMenu(doc, $event)"
            class="group hover:bg-primary/[0.02] transition-colors">
            <td class="px-6 py-5">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex items-center justify-center rounded-xl transition-transform"
                  :class="[getDocumentStyle(doc.has_versions, doc.certification_mode).bgColor, getDocumentStyle(doc.has_versions, doc.certification_mode).color, !doc.has_versions ? 'group-hover:scale-110' : '']">
                  <component :is="getDocumentStyle(doc.has_versions, doc.certification_mode).icon" class="w-5 h-5" />
                </div>
                <div>
                  <NuxtLink :to="`/dashboard/docsentry/${doc.id}`"
                    class="font-bold text-BtW hover:text-primary transition-colors block leading-tight">
                    {{ doc.filename }}
                  </NuxtLink>
                  <span class="text-[10px] text-hsa font-medium uppercase tracking-wider block mt-0.5">
                    {{ doc.id.split('-')[0] }}...
                  </span>
                </div>
              </div>
            </td>
            <td class="px-6 py-5 text-center">
              <div class="inline-flex flex-col items-center">
                <span class="text-BtW font-medium">{{ formatDate(isArchive ? doc.archived_at : doc.created_at).split(' ')[0]
                }}</span>
                <span class="text-[10px] text-hsa uppercase">{{ formatDate(isArchive ? doc.archived_at :
                  doc.created_at).split(' ').slice(1).join(' ')
                }}</span>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-3 bg-ash/40 p-2 rounded-lg border border-ash/50 max-w-[240px]">
                <code class="font-code text-[10px] text-hsa truncate flex-1 leading-none">
        {{ doc.hash }}
      </code>
                <div class="flex items-center gap-1 shrink-0 border-l border-BtW/20 pl-2 ml-1">
                  <UiBaseButton @click="copyHash(doc.hash, doc.id)" variant="ghost"
                    class="!p-1 hover:!text-primary transition-colors !h-auto !w-auto">
                    <IconCopy v-if="!copiedHashes.has(doc.id)" class="w-3.5 h-3.5" />
                    <IconCheck v-else class="w-3.5 h-3.5 text-success" />
                  </UiBaseButton>
                </div>
              </div>
            </td>
            <td class="px-6 py-5 text-center">
              <UiStatusBadge :status="doc.has_certificate ? 'Verified' : 'Pending'" />
            </td>
            <td class="px-6 py-5 text-right">
              <div class="flex justify-end gap-2 h-9 items-center">
                <template v-if="localProcessingId === doc.id">
                  <UiLogoLoader size="xs" />
                </template>
                <template v-else>
                  <NuxtLink :to="`/dashboard/docsentry/${doc.id}`"
                    class="w-9 h-9 flex items-center justify-center bg-ash/50 hover:bg-primary hover:text-white rounded-xl transition-all"
                    title="Consulter">
                    <IconEye class="w-4 h-4" />
                  </NuxtLink>
                  <UiBaseButton v-if="!isArchive" @click="downloadCertificate(doc.id, doc.filename)" variant="ghost"
                    class="!w-9 !h-9 !flex !items-center !justify-center !bg-ash/50 hover:!bg-success hover:!text-white !rounded-xl transition-all !p-0"
                    title="Certificat">
                    <IconDownload class="w-4 h-4" />
                  </UiBaseButton>
                  <UiBaseButton v-if="!isArchive" @click="archiveDocument(doc.id)" variant="ghost"
                    class="!w-9 !h-9 !flex !items-center !justify-center !bg-ash/50 hover:!bg-warning hover:!text-white !rounded-xl transition-all !p-0"
                    title="Archiver">
                    <IconArchive class="w-4 h-4" />
                  </UiBaseButton>
                  <UiBaseButton v-if="isArchive" @click="unarchiveDocument(doc.id)" variant="ghost"
                    class="!w-9 !h-9 !flex !items-center !justify-center !bg-ash/50 hover:!bg-primary hover:!text-white !rounded-xl transition-all !p-0"
                    title="Désarchiver">
                    <IconRotate class="w-4 h-4" />
                  </UiBaseButton>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <MeDocsentryHomeListPagination :current-page="currentPage" :total-pages="totalPages" @next-page="$emit('next-page')"
      @prev-page="$emit('prev-page')" />

    <ModalGlobalShare :show="showShareModal" :title="shareTitle" :text="shareText" :url="shareUrl"
      @close="showShareModal = false" />
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconDownload, IconEye, IconCopy, IconCheck, IconShare, IconArchive, IconRotate } from '@tabler/icons-vue'
import { ref } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Document } from '~/types/docsentry'
import { getDocumentStyle } from '~/utils/docsentry'
import { useToastStore } from '~/stores/front/toast'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { useContextMenu, type ContextMenuItem } from '~/composables/useContextMenu'

const props = defineProps<{
  documents: Document[]
  loading: boolean
  currentPage: number
  totalPages: number
  isArchive?: boolean
}>()

const emit = defineEmits(['next-page', 'prev-page', 'refresh'])

const toast = useToastStore()
const userDocsentryStore = useUserDocsentryStore()
const { showMenu } = useContextMenu()

const showShareModal = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareText = ref('')
const copiedHashes = ref(new Set<string>())
const localProcessingId = ref<string | null>(null)

const copyHash = (hash: string, id: string) => {
  navigator.clipboard.writeText(hash)
  copiedHashes.value.add(id)
  toast.showToast('info', 'Copié', 'Hash copié dans le presse-papier.')
  setTimeout(() => copiedHashes.value.delete(id), 2000)
}

const shareDocument = (doc: Document) => {
  shareUrl.value = `${window.location.origin}/verify?h=${doc.hash}`
  shareTitle.value = `Document CYPASS: ${doc.filename}`
  shareText.value = `Vérifiez l'authenticité de ce document certifié par CYPASS.`
  showShareModal.value = true
}

const handleContextMenu = (doc: Document, e: MouseEvent) => {
  const menuItems: ContextMenuItem[] = [
    {
      label: 'Consulter les détails',
      icon: IconEye,
      action: () => navigateTo(`/dashboard/docsentry/${doc.id}`)
    },
    {
      label: 'Copier le Hash',
      icon: IconCopy,
      action: () => copyHash(doc.hash, doc.id)
    },
    {
      label: 'Partager le lien',
      icon: IconShare,
      action: () => shareDocument(doc)
    },
    {
      label: 'Archiver le document',
      icon: IconArchive,
      action: () => archiveDocument(doc.id),
      hidden: props.isArchive
    },
    {
      label: 'Désarchiver le document',
      icon: IconRotate,
      action: () => unarchiveDocument(doc.id),
      hidden: !props.isArchive
    }
  ].filter(item => !item.hidden) as ContextMenuItem[]

  if (doc.has_certificate) {
    menuItems.push({
      label: 'Télécharger le certificat',
      icon: IconDownload,
      action: () => downloadCertificate(doc.id, doc.filename)
    })
  }

  const menuMetadata = {
    title: 'Document Certifié',
    infos: [
      { label: 'Fichier', value: doc.filename },
      { label: 'ID', value: doc.id.split('-')[0] },
      { label: 'Date', value: formatDate(doc.created_at) }
    ]
  }

  showMenu(e, menuItems, menuMetadata)
}

const downloadCertificate = async (id: string, filename: string) => {
  const success = await userDocsentryStore.downloadCertificate(id, filename)
  if (!success) {
    toast.showToast('error', 'Erreur', userDocsentryStore.error || 'Impossible de télécharger le certificat.')
  }
}

const archiveDocument = async (id: string) => {
  localProcessingId.value = id
  const success = await userDocsentryStore.archiveDocument(id)
  localProcessingId.value = null
  if (success) {
    toast.showToast('success', 'Archivé', 'Document déplacé vers les archives.')
  } else {
    toast.showToast('error', 'Erreur', userDocsentryStore.error || 'Impossible d’archiver le document.')
  }
}

const unarchiveDocument = async (id: string) => {
  localProcessingId.value = id
  const success = await userDocsentryStore.unarchiveDocument(id)
  localProcessingId.value = null
  if (success) {
    toast.showToast('success', 'Désarchivé', 'Document restauré avec succès.')
  } else {
    toast.showToast('error', 'Erreur', userDocsentryStore.error || 'Impossible de désarchiver le document.')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
