<template>
  <UiBaseCard title="VigiTech configuration" class="!rounded-[2rem]">
    <div class="space-y-6">
      <div v-for="setting in settingsList" :key="setting.id"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Toggle Switch Premium -->
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store.display[setting.id]" @change="store.toggleSetting(setting.id)"
            class="sr-only peer">
          <div class="input-toggle-slider">
          </div>
        </label>
      </div>

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
import { IconRotate } from '@tabler/icons-vue'
import { useVigiPrefStore } from '~/stores/vigiPref'

const store = useVigiPrefStore()

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

onMounted(() => {
  store.loadFromLocalStorage()
})
</script>
