<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h3>Historique d'activité</h3>
      <p>Suivi en temps réel de vos activités</p>
    </div>

    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading" class="flex-grow sm:flex-grow-0">
        <template #icon>
          <IconRefresh class="w-4 h-4" />
        </template>
        Actualiser
      </UiBaseButton>
      <UiBaseButton variant="secondary" outlined @click="$emit('reset')" class="flex-grow sm:flex-grow-0">
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
