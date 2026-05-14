<template>
  <UiBaseCard class="p-8 border-ash/30 shadow-sm rounded-[2.5rem]">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-2">
        <IconUsers class="w-5 h-5 text-primary" />
        <h5>Membres</h5>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="i in Math.min(workspace.members_count || 1, 3)" :key="i"
        class="flex items-center gap-3 p-4 rounded-2xl bg-ash/5 border border-ash/10 group/item hover:bg-WtB hover:shadow-md transition-all cursor-default">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xs font-black text-primary border border-ash/20 group-hover/item:scale-110 transition-transform">
          {{ i === 1 ? 'AD' : (i === 2 ? 'JD' : 'MK') }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-black text-BtW truncate">{{ i === 1 ? 'Administrateur' : 'Membre' }}</p>
          <p class="text-[10px] text-hsa font-bold uppercase tracking-tighter">{{ workspace.role === 'owner' &&
            i === 1 ? 'Propriétaire' : 'Collaborateur' }}</p>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconUsers, IconUserPlus } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace
}>()
</script>
