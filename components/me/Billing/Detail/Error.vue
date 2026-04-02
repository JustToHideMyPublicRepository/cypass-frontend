<template>
  <div class="flex flex-col items-center justify-center py-20 bg-ash/10 rounded-3xl border-2 border-dashed border-ash px-6">
    <div class="w-16 h-16 bg-ashAct rounded-full flex items-center justify-center mb-4 text-sm text-hsa/30">
      <IconAlertTriangle class="w-8 h-8" />
    </div>
    <p class="text-sm font-bold text-hsa text-center max-w-md">
      {{ message || 'Impossible de charger les détails de cette transaction.' }}
    </p>
    <UiBaseButton to="/dashboard/billing" variant="ghost" class="mt-4 !text-xs font-black uppercase">
      Retour à l'historique
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconAlertTriangle } from '@tabler/icons-vue'

defineProps<{
  message?: string
}>()
</script>
