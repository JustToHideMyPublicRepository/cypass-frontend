<template>
  <div class="text-center mb-8">
    <h2 class="text-2xl font-black text-BtW uppercase tracking-tight mb-2">Vérification de l'email</h2>
    <p v-if="status === 'loading'" class="text-hsa font-medium">Nous vérifions votre compte...</p>
    <p v-else-if="status === 'success'" class="text-hsa font-medium">Votre email a été vérifié avec succès.</p>
    <p v-else class="text-hsa font-medium">Le lien de vérification est invalide ou a expiré.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  status: 'loading' | 'success' | 'error'
}>()
</script>
