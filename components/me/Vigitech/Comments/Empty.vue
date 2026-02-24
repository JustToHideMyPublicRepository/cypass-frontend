<template>
  <div class="text-center py-20 px-6 glass-panel rounded-[2rem] border-2 border-dashed border-ash">
    <div class="w-16 h-16 bg-ash/10 rounded-2xl flex items-center justify-center text-hsa mx-auto mb-4">
      <IconMessage class="w-8 h-8 opacity-20" />
    </div>
    <h3 class="text-lg font-black text-BtW">Aucun commentaire</h3>
    <p class="text-hsa text-sm mt-2 max-w-sm mx-auto">
      Vous n'avez pas encore commenté d'incident. Rendez-vous sur la veille communautaire pour participer.
    </p>
    <NuxtLink to="/vigitech" class="inline-block mt-4">
      <UiBaseButton variant="primary" size="sm">Voir les incidents</UiBaseButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconMessage } from '@tabler/icons-vue'
</script>
