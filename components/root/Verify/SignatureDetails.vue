<template>
  <div v-if="signatureInfo" class="p-5 bg-ash/5 rounded-2xl border border-ash/50 space-y-4">
    <h4 class="text-xs font-bold text-BtW flex items-center gap-2">
      <IconLock class="w-4 h-4 text-primary" /> Détails Techniques de la Signature
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-[11px]">
      <div class="flex justify-between md:block">
        <span class="text-hsa">Algorithme</span>
        <p class="font-bold text-BtW">{{ signatureInfo.algorithm || 'Ed25519' }}</p>
      </div>
      <div class="flex justify-between md:block">
        <span class="text-hsa">Statut de la Clé</span>
        <p class="font-bold" :class="signatureInfo.key_match ? 'text-success' : 'text-danger'">
          {{ signatureInfo.key_match ? 'Clé Correspondante ✓' : 'Conflit de Clé ✗' }}
        </p>
      </div>
      <div class="md:col-span-2">
        <span class="text-hsa">Empreinte de la Clé publique</span>
        <p class="font-code text-[10px] text-BtW truncate">
          {{ signatureInfo.key_fingerprint || 'N/A' }}
        </p>
      </div>
      <div class="md:col-span-2">
        <span class="text-hsa">Date de Signature</span>
        <p class="font-bold text-BtW">{{ formatDate(signatureInfo.signed_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLock } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

defineProps<{
  signatureInfo: any
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P p', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
