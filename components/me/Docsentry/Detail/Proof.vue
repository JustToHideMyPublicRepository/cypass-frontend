<template>
  <UiBaseCard v-if="doc.signature_info">
    <div class="flex items-center gap-2 mb-6 text-BtW">
      <IconShieldCheck class="w-5 h-5 text-primary" />
      <h3 class="font-bold">Preuve Cryptographique</h3>
    </div>

    <div class="space-y-4">
      <div class="flex justify-between items-center py-3 border-b border-ash/50">
        <span class="text-hsa text-sm">Algorithme de signature</span>
        <span class="text-BtW font-medium">{{ doc.signature_info.algorithm }}</span>
      </div>
      <div class="flex justify-between items-center py-3 border-b border-ash/50">
        <span class="text-hsa text-sm">Empreinte de la clé publique</span>
        <div class="flex items-center gap-2">
          <span class="text-BtW font-code text-xs">{{ doc.signature_info.fingerprint }}</span>
          <UiBaseButton @click="$emit('copy', doc.signature_info.fingerprint, 'fingerprint')" variant="ghost"
            class="!p-1 hover:!text-primary transition-colors !h-auto !w-auto">
            <IconCopy v-if="!copiedFields.fingerprint" class="w-3 h-3" />
            <IconCheck v-else class="w-3 h-3 text-success" />
          </UiBaseButton>
        </div>
      </div>
      <div class="flex justify-between items-center py-3 border-b border-ash/50">
        <span class="text-hsa text-sm">Date de signature</span>
        <span class="text-BtW font-medium">{{ formatDate(doc.signed_at) }}</span>
      </div>
      <div class="flex justify-between items-center py-3">
        <span class="text-hsa text-sm">Statut de la signature</span>
        <span v-if="doc.signature_info.present" class="text-success flex items-center gap-1 font-medium">
          <IconCheck class="w-4 h-4" /> Valide
        </span>
        <span v-else class="text-danger flex items-center gap-1 font-medium">
          <IconX class="w-4 h-4" /> Invalide
        </span>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconCopy, IconCheck, IconX } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

defineProps<{
  doc: any
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
