<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Centre de Signalement</h1>
      <p class="text-hsa text-sm font-medium">
        Gérez vos signalements envoyés et reçus en toute confidentialité.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading">
        <template #icon>
          <IconRefresh class="w-4 h-4" />
        </template>
        Actualiser
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'

defineProps<{
  loading?: boolean
}>()

defineEmits(['refresh'])
</script>
