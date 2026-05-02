<template>
  <div v-if="category"
    class="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10 mb-2 animate-fade-in">
    <div class="p-2 rounded-lg bg-primary/10 text-primary shrink-0 w-fit">
      <component :is="getDocCategoryIcon(category.key)" class="w-4 h-4" />
    </div>
    <div class="flex flex-col md:flex-row md:items-center gap-1">
      <p class="text-[10px] text-hsa font-bold uppercase tracking-wider shrink-0">
        Catégorie sélectionnée :
      </p>
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
