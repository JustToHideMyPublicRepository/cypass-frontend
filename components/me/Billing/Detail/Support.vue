<template>
  <div class="space-y-6">
    <!-- Help Card -->
    <UiBaseCard class="p-6 bg-ash/30 border border-dashed border-ash">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-ash flex items-center justify-center shrink-0">
          <IconLifebuoy class="w-6 h-6 text-hsa" />
        </div>
        <div>
          <h4 class="font-bold text-BtW italic">Besoin d'aide ?</h4>
          <p class="text-xs text-hsa mb-4 leading-relaxed">
            Si vous remarquez une erreur sur cette facture ou si vous avez des questions concernant votre paiement,
            notre équipe est là pour vous assister.
          </p>
          <UiBaseButton to="/contact" variant="secondary" outlined
            class="!text-[10px] font-black uppercase tracking-widest !rounded-xl">
            Contacter le support
          </UiBaseButton>
        </div>
      </div>
    </UiBaseCard>

    <!-- Receipt Card -->
    <UiBaseCard class="p-6">
      <div v-if="status === 'pending'" class="text-center">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <IconCreditCard class="w-6 h-6" />
        </div>
        <h4 class="font-bold text-BtW mb-2">Paiement en attente</h4>
        <p class="text-xs text-hsa mb-4">Votre transaction n'est pas encore finalisée. Cliquez ci-dessous pour terminer le paiement.</p>
        <UiBaseButton :to="checkoutUrl" target="_blank" variant="primary" class="w-full !rounded-xl font-black uppercase tracking-widest text-[11px] py-4">
          Finaliser le paiement
        </UiBaseButton>
      </div>

      <div v-else class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-ash/50 flex items-center justify-center">
            <IconFileText class="w-5 h-5 text-hsa" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-BtW">Reçu de paiement</h4>
            <p class="text-[10px] text-hsa uppercase font-black tracking-widest opacity-50">Document PDF</p>
          </div>
        </div>
        <UiBaseButton v-if="approved" @click="$emit('download')" variant="ghost"
          class="!p-2 !rounded-xl !bg-primary/5 text-primary hover:!bg-primary/10 transition-all">
          <IconDownload class="w-5 h-5" />
        </UiBaseButton>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconLifebuoy, IconFileText, IconDownload, IconCreditCard } from '@tabler/icons-vue'

defineProps<{
  approved: boolean
  status?: string
  checkoutUrl?: string
}>()

defineEmits(['download'])
</script>
