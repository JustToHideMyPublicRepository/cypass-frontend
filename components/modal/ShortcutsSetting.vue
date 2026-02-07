<template>
  <UiBaseModal :show="show" title="Raccourcis" max-width="md" @close="$emit('close')">
    <div class="space-y-6 py-2 max-h-[400px] overflow-y-auto px-1 -mx-1 scrollbar-hide animate-fade-in">
      <!-- Liste des réglages de raccourcis -->
      <div v-for="setting in settingsList" :key="setting.id"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Toggle Switch Premium -->
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store[setting.id]" @change="store.toggleSetting(setting.id)"
            class="sr-only peer">
          <div
            class="w-12 h-6 bg-ashAct/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4.5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner">
          </div>
        </label>
      </div>
    </div>

    <!-- Pied de page avec actions -->
    <template #footer>
      <div class="flex justify-between items-center w-full pt-2">
        <UiBaseButton variant="ghost" size="sm"
          class="!rounded-2xl !text-[11px] font-black uppercase tracking-widest text-hsa hover:text-primary transition-colors !p-3"
          @click="store.resetSettings()">
          <IconRotate class="w-4 h-4 mr-2" />
          Défaut
        </UiBaseButton>
        <UiBaseButton variant="secondary" size="sm"
          class="!rounded-2xl font-black uppercase tracking-widest px-8 shadow-lg" @click="$emit('close')">
          Fermer
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { useShortcutsStore } from '~/stores/shortcuts'
import { IconRotate } from '@tabler/icons-vue'

// Propriétés de la modale de configuration des raccourcis
defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const store = useShortcutsStore()

/**
 * Liste statique des réglages disponibles pour les raccourcis clavier
 */
const settingsList = [
  {
    id: 'enabled' as const,
    title: 'Activation',
    desc: 'Permet la navigation fluide via les touches du clavier.'
  },
  {
    id: 'showHover' as const,
    title: 'Indices au survol',
    desc: 'Affiche [SHIFT + TOUCHE] lors du survol des éléments.'
  },
  {
    id: 'showAlt' as const,
    title: 'Indices Mode ALT',
    desc: 'Révèle les badges d\'aide en maintenant la touche ALT.'
  },
  {
    id: 'showButtonHints' as const,
    title: 'Indices Boutons',
    desc: 'Affiche les touches de décision [Y/N/↵] sur les boutons.'
  }
]
</script>
