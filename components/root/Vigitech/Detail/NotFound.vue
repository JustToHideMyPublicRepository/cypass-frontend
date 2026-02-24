<template>
  <div class="text-center py-32 space-y-6 animate-fade-in max-w-lg mx-auto">
    <IconAlertCircle class="w-16 h-16 text-danger mx-auto opacity-20" />
    <div class="space-y-2">
      <h3 class="text-2xl font-black text-BtW">Incident introuvable</h3>
      <p class="text-hsa font-bold">Ce signalement n'existe pas ou a été retiré pour des raisons de sécurité.</p>
    </div>
    <NuxtLink to="/vigitech" class="block">
      <UiBaseButton variant="ghost">Retourner à la liste</UiBaseButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue'
</script>
