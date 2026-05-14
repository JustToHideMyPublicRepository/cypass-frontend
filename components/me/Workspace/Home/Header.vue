<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h3>Gestion des Workspaces</h3>
      <p>Organisez vos espaces de travail, modifiez ou supprimez-les.</p>
    </div>

    <div class="flex items-center gap-3">
      <UiBaseButton @click="$emit('create')" variant="primary" size="sm">
        <IconPlus class="w-4 h-4 mr-2" /> Nouveau workspace
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'

defineEmits(['create'])
</script>
