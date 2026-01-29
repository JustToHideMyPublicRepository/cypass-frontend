<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Sessions actives</h1>
      <p class="text-hsa text-sm sm:text-base truncate max-w-xs sm:max-w-none">Gérez vos sessions actives sur d'autres
        appareils. ({{ sessionsCount || 0
        }} au total)</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading"
        class="w-full sm:w-auto justify-center">
        Actualiser
      </UiBaseButton>
      <UiBaseButton v-if="hasOtherSessions" variant="danger" outlined @click="$emit('revoke-all')"
        :loading="revokingAll" class="w-full sm:w-auto justify-center text-center">
        Déconnecter toutes les autres sessions
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sessionsCount: number
  hasOtherSessions: boolean
  loading: boolean
  revokingAll: boolean
}>()

defineEmits(['refresh', 'revoke-all'])
</script>
