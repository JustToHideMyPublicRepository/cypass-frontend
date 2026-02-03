<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Vue d'ensemble</h1>
    <div class="text-sm text-hsa">Dernière mise à jour: {{ currentTime }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentTime: string
}>()
</script>
