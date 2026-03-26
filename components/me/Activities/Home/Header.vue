<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Historique d'activité</h1>
      <p class="text-hsa font-medium">
        Suivi en temps réel pour <span class="text-primary font-bold">{{ userEmail || 'votre compte' }}</span>
      </p>
    </div>

    <div class="flex items-center gap-3">
      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading">
        <template #icon>
          <IconRefresh class="w-4 h-4" />
        </template>
        Actualiser
      </UiBaseButton>
      <UiBaseButton variant="secondary" outlined @click="$emit('reset')">
        Réinitialiser
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'

defineProps<{
  userEmail?: string
  loading?: boolean
}>()

defineEmits(['refresh', 'reset'])
</script>
