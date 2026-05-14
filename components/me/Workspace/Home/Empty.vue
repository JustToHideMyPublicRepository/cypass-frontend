<template>
  <UiBaseCard class="p-12 text-center space-y-4 border-dashed border-2 border-ash/30 bg-transparent">
    <div class="w-16 h-16 rounded-full bg-hsa/10 flex items-center justify-center mx-auto text-hsa">
      <IconPlus class="w-8 h-8" />
    </div>
    <div class="space-y-1">
      <h4>Aucun workspace trouvé</h4>
      <p>C'est étrange, vous devriez avoir au moins un workspace personnel.</p>
    </div>

    <UiBaseButton @click="$emit('create')" variant="primary" size="sm" class="mt-4">
      Créer un workspace
    </UiBaseButton>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'

defineEmits(['create'])
</script>
