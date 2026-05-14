<template>
  <div v-if="!isActive"
    class="p-8 rounded-[2.5rem] bg-WtB border border-ash/30 shadow-xl shadow-ash/5 relative overflow-hidden group/switch">
    <div class="mb-4">
      <h5>Envie de basculer ?</h5>
      <p> Ce workspace n'est pas votre espace de travail actuel. </p>
    </div>

    <div class="flex items-center gap-4 justify-center">
      <UiBaseButton @click="$emit('activate', workspace)" variant="primary">
        Activer
      </UiBaseButton>

      <UiBaseButton v-if="!workspace.is_default" @click="$emit('setDefault', workspace.id)" variant="accent"
        :loading="defaultLoading" :disabled="defaultLoading">
        <IconStar class="w-4 h-4 mr-2" /> Défaut
      </UiBaseButton>
      <div v-else
        class="w-full py-3 flex items-center justify-center gap-2 bg-warning/5 border border-warning/20 rounded-2xl text-warning font-black text-xs uppercase tracking-widest">
        <IconStarFilled class="w-4 h-4" /> Par défaut
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconStar, IconStarFilled } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace
  isActive: boolean
  defaultLoading: boolean
}>()

defineEmits(['activate', 'setDefault'])
</script>
