<template>
  <UiBaseModal :show="show" title="Configuration VigiTech" max-width="md" @close="$emit('close')">
    <div class="space-y-6 py-2 max-h-[400px] overflow-y-auto px-1 -mx-1 no-scrollbar animate-fade-in">
      <!-- Liste -->
      <div v-for="setting in settingsList" :key="setting.id"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store.display[setting.id]" @change="store.toggleSetting(setting.id)"
            class="sr-only peer">
          <div class="input-toggle-slider">
          </div>
        </label>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full pt-2">
        <UiBaseButton variant="ghost" size="sm"
          class="!rounded-2xl !text-[11px] font-black uppercase tracking-widest text-hsa hover:text-primary transition-colors !p-3"
          @click="store.resetToDefault()">
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
import { IconRotate } from '@tabler/icons-vue'
import { useVigiPrefStore } from '~/stores/front/vigiPref'

defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const store = useVigiPrefStore()

/**
 * Liste des réglages disponibles dans cette interface
 */
const settingsList = [
  {
    id: 'previewFile' as const,
    title: 'Prévisualisation auto',
    desc: 'Ouvrir automatiquement les fichiers joints dans les détails d\'incidents.'
  },
  {
    id: 'showComments' as const,
    title: 'Commentaires',
    desc: 'Afficher la section commentaires par défaut sur les signalements.'
  }
]
</script>
