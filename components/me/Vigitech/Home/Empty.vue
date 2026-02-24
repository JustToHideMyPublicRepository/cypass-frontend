<template>
  <div class="text-center py-20 px-6 glass-panel rounded-[2rem] border-2 border-dashed border-ash">
    <div class="w-16 h-16 bg-ash/10 rounded-2xl flex items-center justify-center text-hsa mx-auto mb-4">
      <IconShieldCheck class="w-8 h-8 opacity-20" />
    </div>
    <h3 class="text-lg font-black text-BtW">{{ hasActiveFilters ? 'Aucun résultat' : 'Aucun incident signalé' }}
    </h3>
    <p class="text-hsa text-sm mt-2 max-w-sm mx-auto">
      {{
        hasActiveFilters
          ? 'Essayez de modifier vos critères de recherche.'
          : 'Vous n\'avez pas encore soumis de signalement. Rapportez incident.' }}
    </p>
    <UiBaseButton v-if="hasActiveFilters" variant="ghost" size="sm" class="mt-4" @click="$emit('reset')">
      Réinitialiser les filtres
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck } from '@tabler/icons-vue'

defineProps<{
  hasActiveFilters: boolean
}>()

defineEmits(['reset'])
</script>
