<template>
  <div class="flex items-center gap-4 mb-6">
    <UiBaseButton to="/dashboard/billing" variant="ghost"
      class="!p-2 !rounded-xl !bg-ash/50 hover:!bg-primary/10 hover:text-primary transition-all">
      <IconArrowLeft class="w-5 h-5" />
    </UiBaseButton>
    <div>
      <h1 class="text-2xl font-bold text-BtW tracking-tight">Détails du paiement</h1>
      <p class="text-hsa text-xs font-medium uppercase tracking-widest opacity-60">Vue détaillée de la transaction
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'
</script>
