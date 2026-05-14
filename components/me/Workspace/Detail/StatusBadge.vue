<template>
  <div class="space-y-4">
    <!-- Active Status -->
    <div v-if="isActive"
      class="flex items-center justify-between p-4 rounded-3xl bg-primary/5 border border-primary/20">
      <div class="flex items-center gap-2">
        <div
          class="w-10 h-10 rounded-2xl bg-primary text-WtB flex items-center justify-center shadow-lg shadow-primary/20">
          <IconCheck class="w-6 h-6" />
        </div>
        <div>
          <h5 class="text-primary leading-tight">Espace actuel</h5>
          <p class="text-[10px] text-hsa font-bold uppercase tracking-widest mt-0.5">En cours d'utilisation</p>
        </div>
      </div>
      <!-- Default Badge in active state -->
      <div v-if="workspace.is_default"
        class="px-2.5 py-1 rounded-lg bg-warning/10 text-[9px] font-black text-warning border border-warning/20 uppercase tracking-widest">
        Par défaut
      </div>
    </div>

    <!-- Activation Block (if not active) -->
    <div v-else class="flex items-center justify-between p-4 rounded-3xl bg-ash/5 border border-ash/10">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-2xl bg-ash/10 text-hsa flex items-center justify-center border border-ash/20">
          <IconCircleDashed class="w-6 h-6" />
        </div>
        <div>
          <h5 class="text-xs">Inactif</h5>
          <p class="text-[10px] font-bold mt-0.5">Cliquez pour switcher</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="workspace.is_default"
          class="px-2.5 py-1 rounded-lg bg-warning/10 text-[9px] font-black text-warning border border-warning/20 uppercase tracking-widest">
          Défaut
        </div>
        <UiBaseButton @click="$emit('activate', workspace)" variant="primary" size="sm">
          <IconCircleCheck class="w-4 h-4 mr-2" />
          Activer
        </UiBaseButton>
      </div>
    </div>

    <!-- Default Management (if not already default) -->
    <div v-if="!workspace.is_default"
      class="flex items-center justify-between p-4 rounded-3xl bg-ash/5 border border-ash/10 group/default">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-2xl bg-ash/10 text-hsa flex items-center justify-center border border-ash/20">
          <IconStar class="w-6 h-6" />
        </div>
        <div>
          <h5 class="text-xs">Défaut</h5>
          <p class="text-[10px] font-bold mt-0.5">Définir comme espace défaut</p>
        </div>
      </div>
      <UiBaseButton @click="$emit('setDefault', workspace.id)" variant="accent" size="sm" :disabled="defaultLoading">
        <template v-if="defaultLoading">
          <UiLogoLoader size="xs" class="mr-2" />
        </template>
        <template v-else>
          <IconStar class="w-4 h-4 mr-2" />
          Définir
        </template>
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck, IconCheck, IconCircleDashed, IconStar } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace
  isActive: boolean
  defaultLoading?: boolean
}>()

defineEmits(['activate', 'setDefault'])
</script>
