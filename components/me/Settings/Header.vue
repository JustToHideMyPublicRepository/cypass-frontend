<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Paramètres</h1>
      <p class="text-hsa">Personnalisez votre expérience sur CYPASS.</p>
    </div>
    <button @click="toggleAll"
      class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-ash/50 transition-colors text-sm font-bold border border-transparent hover:border-ashAct focus:outline-none focus:ring-2 focus:ring-primary/50 group"
      :class="isAllCollapsed ? 'text-hsa' : 'text-BtW'">
      <!-- Icône de la case (vide, cochée, ou mixte) -->
      <IconSquareMinusFilled v-if="isMixed" class="w-5 h-5 text-primary" />
      <IconSquareChevronUpFilled v-else-if="isAllExpanded" class="w-5 h-5 text-primary" />
      <IconSquareChevronDownFilled v-else class="w-5 h-5 text-hsa group-hover:text-primary transition-colors" />

      <!-- Texte du bouton -->
      <span>{{ isAllCollapsed ? 'Tout déplier' : 'Tout replier' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconSquareChevronUpFilled, IconSquareChevronDownFilled, IconSquareMinusFilled } from '@tabler/icons-vue'
import { useSettingsPrefStore } from '~/stores/settingsPref'

const settingsStore = useSettingsPrefStore()

const trueCount = computed(() => Object.values(settingsStore.display).filter(v => v).length)
const totalCount = computed(() => Object.keys(settingsStore.display).length)

const isAllExpanded = computed(() => trueCount.value === totalCount.value)
const isAllCollapsed = computed(() => trueCount.value === 0)
const isMixed = computed(() => trueCount.value > 0 && trueCount.value < totalCount.value)

const toggleAll = () => {
  // S'il y a un mélange ou si tout est déplié, on replie tout. Sinon on déplie tout.
  if (isMixed.value || isAllExpanded.value) {
    settingsStore.setAll(false)
  } else {
    settingsStore.setAll(true)
  }
}
</script>
