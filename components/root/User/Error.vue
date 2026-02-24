<template>
  <div class="w-full py-20 text-center animate-fade-in">
    <div class="relative inline-block mb-8">
      <div class="absolute inset-0 bg-danger/20 blur-3xl rounded-full"></div>
      <div
        class="relative w-24 h-24 bg-danger/10 rounded-[2.5rem] flex items-center justify-center text-danger mx-auto border border-danger/20">
        <IconAlertCircle class="w-12 h-12" />
      </div>
    </div>

    <div class="max-w-md mx-auto space-y-4">
      <h2 class="text-3xl font-black text-BtW tracking-tighter">Oups ! Profil inaccessible</h2>
      <p class="text-hsa font-bold leading-relaxed px-4">
        {{ message || "Nous n'avons pas pu trouver cet utilisateur ou une erreur s'est produite lors du chargement." }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <UiBaseButton variant="primary" @click="$emit('retry')" class="w-full sm:w-auto px-8">
          Réessayer
        </UiBaseButton>
        <NuxtLink to="/vigitech" class="w-full sm:w-auto">
          <UiBaseButton variant="ghost" class="w-full">Retour à VigiTech</UiBaseButton>
        </NuxtLink>
      </div>
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
