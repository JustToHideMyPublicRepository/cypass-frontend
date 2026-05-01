<template>
  <UiBaseCard>
    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110"
          :class="[getDocumentStyle(doc.has_versions, doc.certification_mode).bgColor, getDocumentStyle(doc.has_versions, doc.certification_mode).color]">
          <component :is="getDocumentStyle(doc.has_versions, doc.certification_mode).icon" class="w-8 h-8" />
        </div>
        <div class="min-w-0 flex-1">
          <h2 class="text-xl font-bold text-BtW truncate">{{ doc.filename }}</h2>
          <p class="text-sm text-hsa truncate">ID: {{ doc.id }}</p>
        </div>
      </div>

      <div class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all" :class="doc.certification_mode === 'enrichie'
        ? 'bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/10'
        : 'bg-hsa/10 text-hsa border-hsa/20'">
        Certification {{ doc.certification_mode }}
      </div>
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
          <UiBaseButton @click="$emit('copy', doc.hash, 'hash')" variant="ghost"
            class="!text-[10px] !text-primary hover:!underline !font-bold !flex !items-center !gap-1 !p-0 !h-auto !bg-transparent hover:!bg-transparent text-left">
            <IconCopy v-if="!copiedFields.hash" class="w-3 h-3" />
            <IconCheck v-else class="w-3 h-3 text-success" />
            {{ copiedFields.hash ? 'Copié' : 'Copier' }}
          </UiBaseButton>
        </div>
        <div class="text-BtW font-code text-sm break-all">{{ doc.hash }}</div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconCopy, IconCheck } from '@tabler/icons-vue'
import { getDocumentStyle } from '~/utils/docsentry'
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
