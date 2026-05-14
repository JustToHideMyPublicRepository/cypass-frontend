<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div v-for="stat in stats" :key="stat.label" class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm flex items-center gap-5">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors" :class="stat.color">
        <component :is="stat.icon" class="w-6 h-6" />
      </div>
      <div class="min-w-0">
        <p class="text-[10px] font-black text-hsa uppercase tracking-widest mb-0.5">{{ stat.label }}</p>
        <h4 class="truncate font-black">{{ stat.value }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconUsers, IconMapPin, IconCalendar } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

const props = defineProps<{
  workspace: Workspace
}>()

const stats = computed(() => [
  {
    label: 'Membres',
    value: props.workspace.members_count || 1,
    icon: IconUsers,
    color: 'bg-primary/5 text-primary border-primary/10'
  },
  {
    label: 'Pays',
    value: props.workspace.country || 'N/A',
    icon: IconMapPin,
    color: 'bg-secondary/5 text-secondary border-secondary/10'
  },
  {
    label: 'Création',
    value: props.workspace.created_at ? new Date(props.workspace.created_at).toLocaleDateString(undefined, {
      month: 'long', year: 'numeric'
    }) : '...',
    icon: IconCalendar,
    color: 'bg-warning/5 text-warning border-warning/10'
  }
].filter(s => s.value !== 'N/A'))
</script>