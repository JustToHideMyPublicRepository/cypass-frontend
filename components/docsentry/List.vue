<template>
  <UiBaseCard class="overflow-hidden p-0">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-hsa uppercase bg-ash/50 border-b border-ash font-black tracking-widest">
          <tr>
            <th class="px-6 py-5 font-black uppercase tracking-widest">Nom du Document</th>
            <th class="px-6 py-5 font-black uppercase tracking-widest">Date d'émission</th>
            <th class="px-6 py-5 font-black uppercase tracking-widest">Empreinte (Hash)</th>
            <th class="px-6 py-5 font-black uppercase tracking-widest">Statut</th>
            <th class="px-6 py-5 font-black uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ash">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 3" :key="i" class="animate-pulse">
              <td colspan="5" class="px-6 py-8 text-center text-hsa">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <span class="ml-2">Chargement...</span>
                </div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="documents.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-hsa">
              <IconFileOff class="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Aucun document trouvé</p>
            </td>
          </tr>

          <!-- Data State -->
          <tr v-else v-for="doc in documents" :key="doc.id" class="hover:bg-ash/30 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded bg-primary/10 text-primary">
                  <IconFileText class="w-5 h-5" />
                </div>
                <div>
                  <NuxtLink :to="`/dashboard/docsentry/${doc.id}`"
                    class="font-medium text-BtW hover:text-primary transition-colors cursor-pointer">
                    {{ doc.filename }}
                  </NuxtLink>
                  <div class="text-[10px] text-hsa uppercase font-mono">ID: {{ doc.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-hsa">
              {{ formatDate(doc.created_at) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 max-w-[200px]">
                <div class="font-mono text-[10px] text-hsa"
                  :class="expandedHashes.has(doc.id) ? 'break-all whitespace-normal' : 'truncate max-w-[150px]'">
                  {{ doc.hash }}
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button @click="copyHash(doc.hash, doc.id)" class="p-1 hover:text-primary transition-colors"
                    title="Copier le hash">
                    <IconCopy v-if="!copiedHashes.has(doc.id)" class="w-3 h-3" />
                    <IconCheck v-else class="w-3 h-3 text-success" />
                  </button>
                  <button @click="toggleHash(doc.id)" class="p-1 hover:text-primary transition-colors"
                    :title="expandedHashes.has(doc.id) ? 'Réduire' : 'Voir tout'">
                    <IconChevronDown class="w-3 h-3 transition-transform"
                      :class="{ 'rotate-180': expandedHashes.has(doc.id) }" />
                  </button>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <UiStatusBadge :status="doc.has_certificate ? 'Verified' : 'Pending'" />
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1">
                <NuxtLink :to="`/dashboard/docsentry/${doc.id}`"
                  class="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  title="Voir les détails">
                  <IconEye class="w-4 h-4" />
                </NuxtLink>
                <button @click="downloadCertificate(doc.id, doc.filename)"
                  class="p-2 hover:bg-success/10 hover:text-success rounded-lg transition-colors"
                  title="Télécharger le certificat">
                  <IconDownload class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls (Synced with meLogs/List.vue style) -->
    <div v-if="totalPages > 1" class="flex items-center justify-between p-6 border-t border-ash">
      <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">
        Page {{ currentPage }} sur {{ totalPages }}
      </p>
      <div class="flex items-center gap-2">
        <button @click="$emit('prev-page')" :disabled="currentPage === 1"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-ash hover:bg-ash transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium text-hsa hover:text-BtW">
          <IconChevronLeft class="w-3 h-3" /> Précédent
        </button>
        <button @click="$emit('next-page')" :disabled="currentPage === totalPages"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-ash hover:bg-ash transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium text-hsa hover:text-BtW">
          Suivant
          <IconChevronRight class="w-3 h-3" />
        </button>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconFileText, IconDownload, IconFileOff, IconEye, IconCopy, IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { ref } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import type { Document } from '~/types/documents'
import { useToastStore } from '~/stores/toast'

const props = defineProps<{
  documents: Document[]
  loading: boolean
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['next-page', 'prev-page'])

const toast = useToastStore()
const expandedHashes = ref(new Set<string>())
const copiedHashes = ref(new Set<string>())

const copyHash = (hash: string, id: string) => {
  navigator.clipboard.writeText(hash)
  copiedHashes.value.add(id)
  toast.showToast('info', 'Copié', 'Hash copié dans le presse-papier.')
  setTimeout(() => copiedHashes.value.delete(id), 2000)
}

const toggleHash = (id: string) => {
  if (expandedHashes.value.has(id)) {
    expandedHashes.value.delete(id)
  } else {
    expandedHashes.value.add(id)
  }
}

const downloadCertificate = async (id: string, filename: string) => {
  try {
    const response = await $fetch('/api/documents/download', {
      query: { id, type: 'certificate' },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(response as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Certificat_${filename}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    toast.showToast('error', 'Erreur', 'Impossible de télécharger le certificat.')
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
