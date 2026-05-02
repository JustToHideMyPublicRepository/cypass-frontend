<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Selected Category Reminder -->
    <ModalDocsentryEnrichedAuthCatSelected :category="category" />

    <div class="py-12 flex flex-col items-center justify-center space-y-6 animate-pulse">
      <UiLogoLoader size="lg" />
      <div class="text-center space-y-2">
        <h4 class="text-lg font-black text-BtW">Analyse en cours</h4>
        <p class="text-sm text-hsa font-medium">DocSentry extrait les métadonnées de votre document...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  category: any
}>()
</script>
