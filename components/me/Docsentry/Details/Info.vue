<template>
  <UiBaseCard>
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-xl bg-primary/10 text-primary">
          <IconFileText class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-BtW">{{ doc.filename }}</h2>
          <p class="text-sm text-hsa">ID: {{ doc.id }}</p>
        </div>
      </div>
      <UiStatusBadge :status="isVerified ? 'Verified' : 'Pending'" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-4 rounded-lg bg-ash/30 border border-ash/50">
        <div class="text-[10px] uppercase text-hsa font-semibold mb-1">Date d'émission</div>
        <div class="text-BtW font-medium">{{ formatDate(doc.created_at) }}</div>
      </div>
      <div class="p-4 rounded-lg bg-ash/30 border border-ash/50">
        <div class="text-[10px] uppercase text-hsa font-semibold mb-1">Type de fichier</div>
        <div class="text-BtW font-medium">{{ doc.file_type?.toUpperCase() }}</div>
      </div>
      <div class="p-4 rounded-lg bg-ash/30 border border-ash/50 sm:col-span-2">
        <div class="flex justify-between items-center mb-1">
          <div class="text-[10px] uppercase text-hsa font-semibold">Hash SHA-256</div>
          <button @click="$emit('copy', doc.hash, 'hash')"
            class="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
            <IconCopy v-if="!copiedFields.hash" class="w-3 h-3" />
            <IconCheck v-else class="w-3 h-3 text-success" />
            {{ copiedFields.hash ? 'Copié' : 'Copier' }}
          </button>
        </div>
        <div class="text-BtW font-mono text-sm break-all">{{ doc.hash }}</div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconFileText, IconCopy, IconCheck } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  doc: any
  isVerified: boolean
  copiedFields: Record<string, boolean>
}>()

defineEmits(['copy'])

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
