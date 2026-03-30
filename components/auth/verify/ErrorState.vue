<template>
  <div class="text-center py-6 animate-fade-up">
    <div
      class="bg-danger/10 text-danger p-6 rounded-3xl mb-6 flex items-center justify-center mx-auto w-24 h-24 shadow-inner">
      <IconCircleX class="h-12 w-12" />
    </div>
    <h2 class="text-xl font-black text-BtW mb-2 uppercase">Échec</h2>
    <p class="mb-8 text-hsa leading-relaxed">
      {{ error || 'Le lien de vérification est invalide ou a expiré.' }}
    </p>

    <div class="space-y-4">
      <UiBaseButton @click="$emit('resend')" :loading="resending" variant="primary" block class="shadow-md">
        Renvoyer le lien
      </UiBaseButton>

      <UiBaseButton to="/auth/register" variant="ghost" size="sm"
        class="!text-slate-400 hover:!text-primary uppercase tracking-widest font-black !text-[10px]">
        Retour à l'inscription
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleX } from '@tabler/icons-vue'

defineProps<{
  error?: string | null
  resending: boolean
}>()

defineEmits<{
  (e: 'resend'): void
}>()
</script>
