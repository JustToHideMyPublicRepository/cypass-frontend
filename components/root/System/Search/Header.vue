<template>
  <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <h1 class="text-3xl font-black text-BtW tracking-tight mb-2">Résultats de recherche</h1>
      <p class="text-hsa font-medium">Affichage des résultats pour "<span class="text-primary">{{ query }}</span>"</p>
    </div>

    <div class="flex items-center gap-3">
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
}>()

defineEmits(['modify', 'reset'])
</script>
