<template>
  <div class="pt-6 border-t border-ash/50 flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center md:text-left">
      <h3 class="text-sm font-bold text-BtW">Désinscription totale</h3>
      <p class="text-xs text-hsa font-medium">Vous ne recevrez plus aucun email de notre part.</p>
    </div>
    <UiBaseButton variant="danger" ghost size="sm" class="!rounded-xl min-w-[140px]" 
      :loading="loading" @click="$emit('confirm')">
      Me désabonner
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

defineEmits<{
  (e: 'confirm'): void
}>()
</script>
