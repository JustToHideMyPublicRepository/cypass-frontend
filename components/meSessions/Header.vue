<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Sessions actives</h1>
      <p class="text-hsa">Gérez vos sessions actives sur d'autres appareils. ({{ sessionsCount || 0 }} au total)</p>
    </div>
    <div class="flex gap-3">
      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading">
        Actualiser
      </UiBaseButton>
      <UiBaseButton v-if="hasOtherSessions" variant="danger" outlined @click="$emit('revoke-all')"
        :loading="revokingAll">
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
