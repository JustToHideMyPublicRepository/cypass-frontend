<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsPref.toggleSection('appearance')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Apparence</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsPref.display.appearance }" />
        </button>
      </div>
    </template>

    <div v-show="settingsPref.display.appearance" class="space-y-4 animate-fade-in">
      <div class="flex items-center justify-between p-4 rounded-xl bg-ash/30 border border-ash">
        <div class="flex items-center gap-4">
          <!-- Icône dynamique selon la préférence actuelle -->
          <div class="p-2 bg-WtB rounded-lg shadow-sm">
            <IconDeviceDesktop v-if="$colorMode.preference === 'system'" class="w-6 h-6 text-primary" />
            <IconMoon v-else-if="$colorMode.preference === 'dark'" class="w-6 h-6 text-primary" />
            <IconSun v-else class="w-6 h-6 text-warning" />
          </div>
          <!-- Label et description -->
          <div>
            <h3 class="font-bold text-BtW">Thème manuel</h3>
            <p class="text-sm text-hsa">Basculer manuellement entre le mode.</p>
          </div>
        </div>
        <!-- Sélecteur de thème natif -->
        <ClientOnly>
          <select v-model="$colorMode.preference" :disabled="isAutoTimeEnabled"
            class="px-4 py-2 rounded-lg bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="system">Système</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </ClientOnly>
      </div>

      <!-- Option Auto basculement selon l'heure -->
      <div class="flex items-center justify-between p-4 rounded-xl bg-ash/30 border border-ash">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-WtB rounded-lg shadow-sm">
            <IconSolarPanel2 class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 class="font-bold text-BtW">Thème automatique</h3>
            <p class="text-sm text-hsa">Laisser le système gérer le thème.</p>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="isAutoTimeEnabled" class="sr-only peer">
          <div class="input-toggle-slider"></div>
        </label>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IconSun, IconMoon, IconDeviceDesktop, IconSolarPanel2, IconChevronDown } from '@tabler/icons-vue'
import { useAutoTheme } from '~/composables/useAutoTheme'
import { useSettingsPrefStore } from '~/stores/settingsPref'

const { isAutoTimeEnabled } = useAutoTheme()
const settingsPref = useSettingsPrefStore()

// Écouter si l'utilisateur modifie le thème manuellement via ThemeToggle.vue
const handleManualOverride = () => {
  isAutoTimeEnabled.value = false
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('theme-manual-override', handleManualOverride)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('theme-manual-override', handleManualOverride)
  }
})
</script>
