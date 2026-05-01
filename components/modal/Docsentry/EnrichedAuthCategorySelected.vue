<template>
  <div v-if="category"
    class="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-2xl bg-ash/20 border border-ash/50 mb-2 animate-fade-in">
    <div class="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
      <component :is="getDocCategoryIcon(category.key)" class="w-4 h-4" />
    </div>
    <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
      <p class="text-[10px] text-hsa font-bold uppercase tracking-wider shrink-0">
        Catégorie sélectionnée
      </p>
      <div class="hidden md:block w-px h-3 bg-ash/50"></div>
      <p class="text-sm font-black text-BtW tracking-wide">
        {{ category.label }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDocCategoryIcon } from '~/utils/docsentry'

defineProps<{
  category: any
}>()
</script>
