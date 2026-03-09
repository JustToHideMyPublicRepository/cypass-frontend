<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsPref.toggleSection('vigitech')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Configuration VigiTech</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsPref.display.vigitech }" />
        </button>
      </div>
    </template>

    <div v-show="settingsPref.display.vigitech" class="space-y-6 animate-fade-in">
      <div v-for="setting in settingsList" :key="setting.id"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <!-- Titre du réglage -->
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <!-- Description explicative -->
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Interrupteur pour basculer la préférence -->
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store.display[setting.id]" @change="store.toggleSetting(setting.id)"
            class="sr-only peer">
          <div class="input-toggle-slider">
          </div>
        </label>
      </div>

      <!-- Action pour réinitialiser les préférences VigiTech -->
      <div class="pt-4 flex justify-end">
        <UiBaseButton @click="store.resetToDefault" variant="ghost"
          class="!inline-flex !items-center !gap-2 !px-3 !py-1.5 !text-[11px] !font-bold !uppercase tracking-wider">
          <IconRotate class="w-4 h-4" />
          Restaurer Defaults
        </UiBaseButton>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconRotate, IconChevronDown } from '@tabler/icons-vue'
import { useVigiPrefStore } from '~/stores/front/vigiPref'
import { useSettingsPrefStore } from '~/stores/front/settingsPref'

// Accès au store des préférences VigiTech
const store = useVigiPrefStore()
const settingsPref = useSettingsPrefStore()

/**
 * Définition des options disponibles pour VigiTech.
 */
const settingsList = [
  {
    id: 'previewFile' as const,
    title: 'Prévisualisation auto',
    desc: 'Ouvrir automatiquement les fichiers joints dans les détails d\'incidents.'
  },
  {
    id: 'showComments' as const,
    title: 'Afficher les commentaires',
    desc: 'La section des commentaires est visible par défaut sur les signalements.'
  }
]

// Chargement initial des préférences depuis le stockage local (LocalStorage)
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>
