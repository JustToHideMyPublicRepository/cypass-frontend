<template>
  <div class="space-y-4 animate-fade-in">
    <UiAppBreadcrumbs :items="[
      { label: 'Tableau de bord', path: `/dashboard/${slug}` },
      { label: 'VigiTech', path: `/dashboard/vigitech` },
      { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
    ]" />

    <!-- Header -->
    <div>
      <h4>Détails du signalement</h4>
      <p>Référence: {{ route.params.id }}</p>
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
