<template>
  <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <h1 class="text-3xl font-black text-BtW tracking-tight mb-2">Résultats de recherche</h1>
      <p class="text-hsa font-medium">Affichage des résultats pour "<span class="text-primary">{{ query }}</span>"</p>
    </div>

    <div class="flex items-center gap-3">
      <!-- Filtre de tri -->
      <div class="flex items-center gap-2 mr-2">
        <label for="sort" class="text-[10px] font-black text-hsa uppercase tracking-widest hidden sm:block">Trier
          par</label>
        <select :value="sortValue" @change="$emit('update:sortValue', ($event.target as HTMLSelectElement).value)"
          class="px-3 py-1.5 rounded-lg bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-xs cursor-pointer font-bold">
          <option value="default">Catégorie</option>
          <option value="alpha-asc">Nom (A-Z)</option>
          <option value="alpha-desc">Nom (Z-A)</option>
          <option value="count-desc">Plus d'éléments</option>
          <option value="count-asc">Moins d'éléments</option>
        </select>
      </div>

      <UiBaseButton v-if="resultsCount === 0" variant="primary" @click="$emit('modify')"
        class="gap-2 shadow-lg shadow-primary/20">
        <IconSearch class="w-4 h-4" />
        Modifier la recherche
      </UiBaseButton>
      <UiBaseButton variant="ghost" @click="$emit('reset')" class="gap-2 hover:bg-ash border border-ash">
        <IconRotate class="w-4 h-4" />
        Réactualiser
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconRotate } from '@tabler/icons-vue'

defineProps<{
  query: string
  resultsCount: number
  sortValue: string
}>()

defineEmits(['modify', 'reset', 'update:sortValue'])
</script>
