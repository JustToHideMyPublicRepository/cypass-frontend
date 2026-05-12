<template>
  <div class="space-y-4 animate-fade-in">
    <UiAppBreadcrumbs :items="[
      { label: 'Tableau de bord', path: `/dashboard/${slug}` },
      { label: 'VigiTech', path: `/dashboard/vigitech` },
      { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
    ]" />

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-black text-BtW">Détails du signalement</h1>
      <p class="text-xs font-bold text-hsa uppercase tracking-widest">Référence: {{ route.params.id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { decodeHtmlEntities } from '~/utils/format'
import { useWorkspaceStore } from '~/stores/back/user/workspace'

const route = useRoute()
const wsStore = useWorkspaceStore()
const slug = computed(() => wsStore.activeWorkspace?.slug || '')

defineProps<{
  incident?: any
}>()
</script>
