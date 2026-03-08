<template>
  <div class="space-y-6">
    <UiBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'Notifications', path: '/dashboard/notifications' },
      { label: title || 'Détail' }
    ]" />

    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/notifications" class="p-2 hover:bg-ash/50 rounded-lg transition-colors text-hsa">
        <IconArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-BtW">Détail de la notification</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

defineProps<{
  title?: string
}>()
</script>
