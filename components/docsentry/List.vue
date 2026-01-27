<template>
  <UiBaseCard class="overflow-hidden p-0">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-hsa uppercase bg-ash/50 border-b border-ash">
          <tr>
            <th class="px-6 py-4 font-semibold">Nom du Document</th>
            <th class="px-6 py-4 font-semibold">Date d'émission</th>
            <th class="px-6 py-4 font-semibold">Empreinte (Hash)</th>
            <th class="px-6 py-4 font-semibold">Statut</th>
            <th class="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ash">
          <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
            <td colspan="5" class="px-6 py-8 text-center text-hsa">Chargement...</td>
          </tr>
          <tr v-else-if="documents.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-hsa">
              <IconFileOff class="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Aucun document trouvé</p>
            </td>
          </tr>
          <tr v-for="doc in documents" :key="doc.id" class="hover:bg-ash/30 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded bg-primary/10 text-primary">
                  <IconFileText class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-medium text-BtW">{{ doc.filename }}</div>
                  <div class="text-[10px] text-hsa uppercase font-mono">ID: {{ doc.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-hsa">
              {{ formatDate(doc.created_at) }}
            </td>
            <td class="px-6 py-4 font-code text-[10px] text-hsa max-w-[150px] truncate" :title="doc.hash">
              {{ doc.hash }}
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
                <button class="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  title="Télécharger">
                  <IconDownload class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconFileText, IconDownload, IconFileOff, IconEye } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import type { Document } from '~/types/documents'

defineProps<{
  documents: Document[]
  loading: boolean
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
