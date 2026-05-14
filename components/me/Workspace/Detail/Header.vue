<template>
  <div class="flex items-center justify-between">
    <NuxtLink to="/dashboard/manage/workspace"
      class="group flex items-center gap-2 text-hsa hover:text-primary transition-all font-bold text-sm bg-ash/10 px-4 py-2 rounded-xl border border-ash/20">
      <IconArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Retour à la liste
    </NuxtLink>

    <div v-if="workspace" class="flex items-center gap-3">
      <UiBaseButton v-if="workspace.role === 'owner' && !workspace.is_default" @click="$emit('delete')" variant="danger"
        size="sm">
        <IconTrash class="w-4 h-4 mr-2" /> Supprimer le workspace
      </UiBaseButton>
      <UiBaseButton @click="$emit('edit', workspace)" variant="primary" size="sm"
        class="!rounded-xl shadow-lg shadow-primary/20">
        <IconEdit class="w-4 h-4 mr-2" /> Modifier le profil
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft, IconTrash, IconEdit } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace | null
}>()

defineEmits(['delete', 'edit'])
</script>