<template>
  <UiBaseCard title="Raccourcis Clavier">
    <div class="space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-ash last:border-0 last:pb-0">
        <div>
          <h3 class="font-medium text-BtW">Activer les raccourcis</h3>
          <p class="text-xs text-hsa mt-0.5">Permet d'utiliser les touches clavier pour naviguer.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="shortcutsStore.enabled" @change="shortcutsStore.save()" class="sr-only peer">
          <div
            class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
          </div>
        </label>
      </div>
      <div class="flex items-center justify-between pb-4 border-b border-ash last:border-0 last:pb-0">
        <div>
          <h3 class="font-medium text-BtW">Indices au survol</h3>
          <p class="text-xs text-hsa mt-0.5">Affiche [SHIFT + TOUCHE] lors du survol d'un lien.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="shortcutsStore.showHover" @change="shortcutsStore.save()"
            class="sr-only peer">
          <div
            class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
          </div>
        </label>
      </div>
      <div class="flex items-center justify-between pb-4 border-b border-ash last:border-0 last:pb-0">
        <div>
          <h3 class="font-medium text-BtW">Mode ALT</h3>
          <p class="text-xs text-hsa mt-0.5">Affiche les badges d'aide en maintenant la touche ALT.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="shortcutsStore.showAlt" @change="shortcutsStore.save()" class="sr-only peer">
          <div
            class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
          </div>
        </label>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { useShortcutsStore } from '~/stores/shortcuts'

const shortcutsStore = useShortcutsStore()
</script>
