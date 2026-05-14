<template>
  <div class="space-y-4">
    <!-- Active Status -->
    <div v-if="isActive"
      class="flex items-center justify-between p-4 rounded-3xl bg-primary/5 border border-primary/20">
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-2xl bg-primary text-WtB flex items-center justify-center shadow-lg shadow-primary/20">
          <IconCheck class="w-6 h-6" />
        </div>
        <div>
          <h5 class="text-primary">Espace Actuel</h5>
          <p class="text-xs">Vous travaillez actuellement dans cet espace.</p>
        </div>
      </div>
      <!-- Default Badge in active state -->
      <div v-if="workspace.is_default"
        class="px-3 py-1 rounded-xl bg-warning/10 text-[10px] font-black text-warning border border-warning/20 uppercase tracking-widest">
        Défaut
      </div>
    </div>

    <!-- Activation Button (if not active) -->
    <div v-else class="flex items-center justify-between p-4 rounded-3xl bg-ash/5 border border-ash/10">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-2xl bg-ash/10 text-hsa flex items-center justify-center border border-ash/20">
          <IconCircleDashed class="w-6 h-6" />
        </div>
        <div>
          <h5>Inactif</h5>
          <p class="text-xs">Cet espace n'est pas sélectionné.</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="workspace.is_default"
          class="px-3 py-1 rounded-xl bg-warning/10 text-[10px] font-black text-warning border border-warning/20 uppercase tracking-widest">
          Défaut
        </div>
        <UiBaseButton @click="$emit('activate', workspace)" variant="primary" size="sm">
          Activer
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconCircleDashed } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace
  isActive: boolean
}>()

defineEmits(['activate'])
</script>
