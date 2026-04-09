<template>
  <div class="text-center relative z-10 space-y-6">
    <div class="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg border border-error/20 bg-error/10">
      <IconMailX class="w-10 h-10 text-error" />
    </div>
    <div class="space-y-2">
      <h2 class="text-2xl font-black text-BtW tracking-tight">Accès refusé</h2>
      <p class="text-sm font-medium text-error leading-relaxed">
        {{ message || 'Le lien de gestion est invalide ou a expiré.' }}
      </p>
    </div>
    <div class="pt-4">
      <UiBaseButton variant="primary" class="w-full !rounded-2xl min-h-[3rem]" @click="$emit('reset')">
        Renvoyer un lien
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMailX } from '@tabler/icons-vue'

defineProps<{
  message?: string
}>()

defineEmits<{
  (e: 'reset'): void
}>()
</script>
