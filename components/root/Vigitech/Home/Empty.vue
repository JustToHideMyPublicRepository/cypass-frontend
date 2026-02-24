<template>
  <div class="text-center py-20 glass-panel rounded-[2.5rem] border-2 border-dashed border-ash">
    <IconShieldCheck class="w-12 h-12 text-primary mx-auto mb-4 opacity-20" />
    <h3 class="text-xl font-black text-BtW">{{ hasActiveFilters ? 'Aucun résultat' : 'Aucun incident' }}</h3>
    <p class="text-xs text-hsa font-bold mt-2">
      {{ hasActiveFilters ? 'Essayez de modifier vos critères de recherche.'
        : 'La plateforme est actuellement calme.'
      }}</p>
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
