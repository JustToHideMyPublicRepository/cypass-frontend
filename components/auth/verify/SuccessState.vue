<template>
  <div class="text-center py-6 animate-fade-up">
    <div
      class="bg-success/10 text-success p-6 rounded-3xl mb-6 flex items-center justify-center mx-auto w-24 h-24 shadow-inner">
      <IconCheck class="h-12 w-12" />
    </div>
    <h2 class="text-xl font-black text-BtW mb-2 uppercase">Félicitations !</h2>
    <p class="mb-8 text-hsa leading-relaxed">{{ message || 'Votre compte a été activé avec succès.' }}</p>
    <UiBaseButton to="/auth/login" variant="primary" block size="lg" class="shadow-lg shadow-primary/20">
      Se connecter
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

defineProps<{
  message?: string | null
}>()
</script>
