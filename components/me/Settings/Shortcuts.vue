<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsPref.toggleSection('shortcuts')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Raccourcis clavier</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsPref.display.shortcuts }" />
        </button>
      </div>
    </template>

    <div v-show="settingsPref.display.shortcuts" class="space-y-6 animate-fade-in">
      <div v-for="setting in settingsList" :key="setting.id"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <!-- Intitulé du raccourci -->
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <!-- Description de l'effet du raccourci -->
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Interrupteur pour activer/désactiver l'option -->
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="shortcutsStore[setting.id]" @change="shortcutsStore.save()"
            class="sr-only peer">
          <div class="input-toggle-slider">
          </div>
        </label>
      </div>

      <!-- Réitialiser -->
      <div class="pt-4 flex justify-end">
        <UiBaseButton @click="shortcutsStore.resetSettings()" variant="ghost"
          class="!inline-flex !items-center !gap-2 !px-3 !py-1.5 !text-[11px] !font-bold !uppercase tracking-wider">
          <IconRotate class="w-4 h-4" />
          Restaurer Defaults
        </UiBaseButton>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { useShortcutsStore } from '~/stores/shortcuts'
import { useSettingsPrefStore } from '~/stores/settingsPref'
import { IconRotate, IconChevronDown } from '@tabler/icons-vue'

// Accès au store global des raccourcis
const shortcutsStore = useShortcutsStore()
const settingsPref = useSettingsPrefStore()

// Définition des options disponibles pour les raccourcis.
const settingsList = [
  {
    id: 'enabled' as const,
    title: 'Activer les raccourcis',
    desc: 'Permet d\'utiliser les touches clavier pour naviguer.'
  },
  {
    id: 'showHover' as const,
    title: 'Indices au survol',
    desc: 'Affiche [SHIFT + TOUCHE] lors du survol d\'un lien.'
  },
  {
    id: 'showAlt' as const,
    title: 'Mode ALT',
    desc: 'Affiche les badges d\'aide en maintenant la touche ALT.'
  },
  {
    id: 'showButtonHints' as const,
    title: 'Raccourcis sur boutons',
    desc: 'Affiche les touches [Y/N/↵] sur les boutons d\'action.'
  }
]
</script>
