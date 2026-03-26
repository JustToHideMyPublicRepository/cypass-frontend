<template>
  <!-- Skeleton Loading -->
  <div v-if="loading" class="space-y-6">
    <UiAppSkeleton width="100%" height="200px" />
    <UiAppSkeleton width="100%" height="400px" />
  </div>

  <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
    <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
    <h3 class="text-lg font-semibold text-BtW mb-2">Erreur</h3>
    <p class="text-hsa">{{ error }}</p>
    <UiBaseButton class="mt-4" @click="$emit('retry')">Réessayer</UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue'

defineProps<{
  loading?: boolean
  error?: string | null
}>()

defineEmits(['retry'])
</script>
