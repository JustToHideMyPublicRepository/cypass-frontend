<template>
  <BaseModal :show="show" title="Paramètres des raccourcis" max-width="sm" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <div v-for="setting in settingsList" :key="setting.id"
        class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-ash/20 border border-ash/50 transition-all">
        <div class="flex-1">
          <h4 class="font-bold text-BtW text-sm">{{ setting.title }}</h4>
          <p class="text-[10px] text-hsa leading-tight mt-0.5">{{ setting.desc }}</p>
        </div>

        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="store[setting.id]" @change="store.toggleSetting(setting.id)"
            class="sr-only peer">
          <div
            class="w-10 h-5 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary">
          </div>
        </label>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <UiBaseButton variant="secondary" size="sm" class="rounded-xl" @click="$emit('close')">
          Fermer
        </UiBaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../ui/BaseModal.vue'
import { useShortcutsStore } from '~/stores/shortcuts'

defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const store = useShortcutsStore()

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
    title: 'Indices Mode ALT',
    desc: 'Affiche les badges d\'aide en maintenant la touche ALT.'
  }
]
</script>
