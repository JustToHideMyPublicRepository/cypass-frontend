<template>
  <div class="py-24 text-center space-y-8 animate-fade-in max-w-lg mx-auto">
    <div class="relative inline-block">
      <div class="absolute inset-0 bg-danger/20 blur-3xl rounded-full"></div>
      <IconAlertCircle class="w-20 h-20 text-danger relative z-10 mx-auto" />
    </div>
    <div class="space-y-4">
      <h2 class="text-3xl font-black text-BtW tracking-tighter">Oups ! Une erreur est survenue</h2>
      <p class="text-hsa font-medium leading-relaxed">
        Nous rencontrons des difficultés techniques pour récupérer les détails de cet incident.
      </p>
    </div>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
      <UiBaseButton variant="primary" @click="$emit('retry')" class="w-full sm:w-auto">
        Réessayer
      </UiBaseButton>
      <NuxtLink to="/vigitech" class="w-full sm:w-auto">
        <UiBaseButton variant="ghost" class="w-full">
          Retourner à la liste
        </UiBaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue'

defineProps<{
  message?: string
}>()

defineEmits(['retry'])
</script>
