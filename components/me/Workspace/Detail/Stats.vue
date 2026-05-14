<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm">
      <div
        class="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 border border-primary/10">
        <IconUsers class="w-6 h-6" />
      </div>
      <p>Membres</p>
      <h4>{{ workspace.members_count || 1 }}</h4>
    </div>
    <div v-if="workspace.country" class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm">
      <div
        class="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-6 border border-secondary/10">
        <IconMapPin class="w-6 h-6" />
      </div>
      <p>Pays</p>
      <h4>{{ workspace.country }}</h4>
    </div>
    <div class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm">
      <div
        class="w-12 h-12 rounded-2xl bg-warning/5 flex items-center justify-center text-warning mb-6 border border-warning/10">
        <IconCalendar class="w-6 h-6" />
      </div>
      <p>Création</p>
      <h4>{{ new Date(workspace.created_at).toLocaleDateString(undefined, {
        month: 'long', year: 'numeric'
      }) }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUsers, IconMapPin, IconCalendar } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace
}>()
</script>