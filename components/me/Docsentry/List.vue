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
          <template v-if="loading">
            <tr v-for="i in 3" :key="i" class="animate-pulse">
              <td colspan="5" class="px-6 py-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-ash rounded-xl"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 bg-ash rounded w-1/3"></div>
                    <div class="h-3 bg-ash rounded w-1/4"></div>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="documents.length === 0">
            <td colspan="5" class="px-6 py-20 text-center">
              <div class="flex flex-col items-center justify-center space-y-4 opacity-30">
                <div class="p-4 bg-ash rounded-full">
                  <IconFileOff class="w-12 h-12 text-hsa" />
                </div>
                <div class="space-y-1">
                  <p class="text-lg font-bold text-BtW">Aucun document</p>
                  <p class="text-sm">Commencez par certifier votre premier document.</p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Data State -->
          <tr v-else v-for="doc in documents" :key="doc.id" class="group hover:bg-primary/[0.02] transition-colors">
            <td class="px-6 py-5">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <IconFileText class="w-5 h-5" />
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
              <div class="flex items-center gap-3 bg-ash/30 p-2 rounded-lg border border-ash/50 max-w-[240px]">
                <code class="font-mono text-[10px] text-hsa truncate flex-1 leading-none">
        {{ doc.hash }}
      </code>
                <div class="flex items-center gap-1 shrink-0 border-l border-ash/50 pl-2 ml-1">
                  <button @click="copyHash(doc.hash, doc.id)" class="p-1 hover:text-primary transition-colors">
                    <IconCopy v-if="!copiedHashes.has(doc.id)" class="w-3.5 h-3.5" />
                    <IconCheck v-else class="w-3.5 h-3.5 text-success" />
                  </button>
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
                <button @click="downloadCertificate(doc.id, doc.filename)"
                  class="w-9 h-9 flex items-center justify-center bg-ash/50 hover:bg-success hover:text-white rounded-xl transition-all"
                  title="Certificat">
                  <IconDownload class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-5 border-t border-ash/50 bg-ash/10">
      <div class="flex items-center gap-2">
        <div class="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-hsa">
          Page {{ currentPage }} / {{ totalPages }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="$emit('prev-page')" :disabled="currentPage === 1"
          class="flex items-center justify-center p-2 rounded-xl border border-ash bg-WtB text-hsa hover:bg-ash hover:text-BtW transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <IconChevronLeft class="w-4 h-4" />
        </button>
        <button @click="$emit('next-page')" :disabled="currentPage === totalPages"
          class="flex items-center justify-center p-2 rounded-xl border border-ash bg-WtB text-hsa hover:bg-ash hover:text-BtW transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <IconChevronRight class="w-4 h-4" />
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
