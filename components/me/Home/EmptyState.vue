<template>
  <div class="text-center space-y-8 animate-fade-up max-w-md mx-auto">
    <div class="w-24 h-24 bg-ash/20 rounded-full flex items-center justify-center mx-auto text-hsa relative">
      <IconBuilding class="w-12 h-12" />
      <div
        class="absolute -top-1 -right-1 w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center text-warning border border-warning/20">
        <IconPlus class="w-4 h-4" />
      </div>
    </div>
    <div class="space-y-3">
      <h3>Aucun espace trouvé</h3>
      <p> Il semble que vous n'ayez pas encore d'espace de travail. Créez-en un pour commencer à gérer vos documents et
        incidents. </p>
    </div>

    <UiBaseButton @click="$emit('create')" variant="primary" size="lg" class="w-full shadow-lg shadow-primary/20">
      <IconPlus class="w-5 h-5 mr-3" /> Créer mon premier workspace
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconBuilding, IconPlus } from '@tabler/icons-vue'
defineEmits(['create'])
</script>
