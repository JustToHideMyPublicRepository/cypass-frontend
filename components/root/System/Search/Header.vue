<template>
  <div class="mb-8">
    <h1 class="text-3xl font-black text-BtW tracking-tight mb-2">Résultats de recherche</h1>
    <p class="text-hsa font-medium">Affichage des résultats pour "<span class="text-primary">{{ query }}</span>"</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  query: string
}>()
</script>
