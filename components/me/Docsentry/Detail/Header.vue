<template>
  <div class="space-y-6">
    <UiAppBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'DocSentry', path: '/dashboard/docsentry' },
      { label: filename || 'Détails' }
    ]" />

    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-BtW">Détails du document</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filename?: string
}>()
</script>
