<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
    <UiBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'VigiTech', path: '/dashboard/vigitech' },
      { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
    ]" />

    <!-- Header -->
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-BtW">Détails du Signalement</h1>
        <p class="text-xs font-bold text-hsa uppercase tracking-widest">Référence: {{ route.params.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decodeHtmlEntities } from '~/utils/format'

const route = useRoute()
defineProps<{
  incident?: any
}>()
</script>
