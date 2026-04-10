<template>
  <UiBaseCard class="overflow-hidden p-0 border-none shadow-xl shadow-ash/20">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="text-[10px] text-hsa uppercase bg-ash/30 border-b border-ash font-bold tracking-[0.2em]">
          <tr>
            <th class="px-6 py-4">Fichier</th>
            <th class="px-6 py-4 text-center">Émission</th>
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
                  :class="doc.has_versions ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary group-hover:scale-110'">
                  <IconFiles v-if="doc.has_versions" class="w-5 h-5" />
                  <IconFile v-else class="w-5 h-5" />
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
                <span class="text-BtW font-medium">{{ formatDate(doc.created_at).split(' ')[0] }}</span>
                <span class="text-[10px] text-hsa uppercase">{{ formatDate(doc.created_at).split(' ').slice(1).join(' ')
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
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/dashboard/docsentry/${doc.id}`"
                  class="w-9 h-9 flex items-center justify-center bg-ash/50 hover:bg-primary hover:text-white rounded-xl transition-all"
                  title="Consulter">
                  <IconEye class="w-4 h-4" />
                </NuxtLink>
                <UiBaseButton @click="downloadCertificate(doc.id, doc.filename)" variant="ghost"
                  class="!w-9 !h-9 !flex !items-center !justify-center !bg-ash/50 hover:!bg-success hover:!text-white !rounded-xl transition-all !p-0"
                  title="Certificat">
                  <IconDownload class="w-4 h-4" />
                </UiBaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <MeDocsentryHomeListPagination 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @next-page="$emit('next-page')" 
      @prev-page="$emit('prev-page')" 
    />
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconFile, IconDownload, IconEye, IconCopy, IconCheck, IconShare, IconFiles } from '@tabler/icons-vue'
import { ref } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Document } from '~/types/docsentry'
import { useToastStore } from '~/stores/front/toast'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { useContextMenu, type ContextMenuItem } from '~/composables/useContextMenu'

const props = defineProps<{
  documents: Document[]
  loading: boolean
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['next-page', 'prev-page'])

const toast = useToastStore()
const userDocsentryStore = useUserDocsentryStore()
const { showMenu } = useContextMenu()

const copiedHashes = ref(new Set<string>())

const copyHash = (hash: string, id: string) => {
  navigator.clipboard.writeText(hash)
  copiedHashes.value.add(id)
  toast.showToast('info', 'Copié', 'Hash copié dans le presse-papier.')
  setTimeout(() => copiedHashes.value.delete(id), 2000)
}

const shareDocument = async (doc: Document) => {
  const publicUrl = `${window.location.origin}/verify?h=${doc.hash}`
  const shareData = {
    title: `Document CYPASS: ${doc.filename}`,
    text: `Vérifiez l'authenticité de ce document certifié par CYPASS.`,
    url: publicUrl
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(publicUrl)
      toast.showToast('success', 'Lien public copié', 'Le lien de vérification a été copié.')
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.warn('Share failed', err)
    }
  }
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
    }
  ]

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

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
