<template>
  <UiBaseModal :show="show" title="Préférences d'affichage" max-width="md" @close="$emit('close')">
    <div class="space-y-6 py-2 max-h-[400px] overflow-y-auto px-1 -mx-1 scrollbar-hide animate-fade-in">
      <p class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] px-2 mb-4">Configuration VigiTech</p>

      <!-- Preview Files -->
      <div
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">Prévisualisation auto</h4>
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">Ouvrir automatiquement les fichiers
            joints</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store.display.previewFile" @change="store.toggleSetting('previewFile')"
            class="sr-only peer">
          <div
            class="w-12 h-6 bg-ashAct/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm">
          </div>
        </label>
      </div>

      <!-- Show Comments -->
      <div
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">Commentaires</h4>
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">Afficher la section commentaires par
            défaut</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store.display.showComments" @change="store.toggleSetting('showComments')"
            class="sr-only peer">
          <div
            class="w-12 h-6 bg-ashAct/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm">
          </div>
        </label>
      </div>

      <!-- Reset -->
      <div class="pt-4 flex justify-center">
        <button @click="store.resetToDefault"
          class="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-danger/10 text-danger transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-danger/20">
          <IconRotateClockwise2 class="w-4 h-4" />
          Réinitialiser par défaut
        </button>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end pt-4">
        <UiBaseButton variant="primary" size="sm" @click="$emit('close')" class="!px-8 !rounded-xl">
          Terminer
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconRotateClockwise2 } from '@tabler/icons-vue'
import { useVigiPrefStore } from '~/stores/vigiPref'

defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const store = useVigiPrefStore()
</script>
