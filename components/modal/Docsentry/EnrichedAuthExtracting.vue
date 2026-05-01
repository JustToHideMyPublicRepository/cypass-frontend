<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Selected Category Reminder -->
    <div v-if="category"
      class="flex items-center gap-3 p-3 rounded-2xl bg-ash/20 border border-ash/50 mb-2">
      <div class="p-2 rounded-lg bg-primary/10 text-primary">
        <component :is="getDocCategoryIcon(category.key)" class="w-4 h-4" />
      </div>
      <div>
        <p class="text-[10px] text-hsa font-bold uppercase tracking-wider">Catégorie sélectionnée</p>
        <p class="text-sm font-bold text-BtW">{{ category.label }}</p>
      </div>
    </div>

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
import { getDocCategoryIcon } from '~/utils/docsentry'

defineProps<{
  category: any
}>()
</script>
