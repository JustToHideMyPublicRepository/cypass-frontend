<template>
  <div class="space-y-6">
    <UiAppBreadcrumbs :items="breadcrumbItems" />

    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-BtW">Détails du document</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'

const props = defineProps<{
  filename?: string
}>()

const wsStore = useWorkspaceStore()
const slug = computed(() => wsStore.activeWorkspace?.slug || '')

const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: `/dashboard/${slug.value}` },
  { label: 'DocSentry', path: `/dashboard/${slug.value}/docsentry` },
  { label: props.filename || 'Détails' }
])
</script>
