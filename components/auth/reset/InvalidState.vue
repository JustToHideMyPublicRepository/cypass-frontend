<template>
  <div class="text-center py-6">
    <div class="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
      <IconCircleX class="w-8 h-8" />
    </div>
    <p class="text-danger font-bold mb-6">Lien de réinitialisation invalide ou expiré.</p>
    <UiBaseButton to="/auth/login" variant="secondary" size="sm" block>
      Retour à la connexion
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconCircleX } from '@tabler/icons-vue'
</script>
