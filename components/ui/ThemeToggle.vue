<template>
  <UiBaseButton @click="toggleTheme" variant="ghost"
    class="!relative !p-2 !rounded-full hover:!bg-ash transition-colors duration-300 !h-auto !w-auto"
    :title="themeTitle" aria-label="Toggle Theme">
    <Transition name="fade" mode="out-in">
      <IconDeviceDesktop v-if="colorMode.preference === 'system'" class="w-5 h-5 text-primary" />
      <IconSun v-else-if="colorMode.preference === 'light'" class="w-5 h-5 text-yellow-500" />
      <IconMoon v-else class="w-5 h-5 text-slate-600" />
    </Transition>

    <!-- Indicateur d'heure automatique -->
    <div v-if="isAutoTimeEnabled"
      class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-WtB shadow-sm border border-ash text-primary">
      <IconBrightnessAuto class="w-3.5 h-3.5 animate-pulse" />
    </div>
  </UiBaseButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconSun, IconMoon, IconDeviceDesktop, IconBrightnessAuto } from '@tabler/icons-vue'
import { useAutoTheme } from '~/composables/useAutoTheme'

const colorMode = useColorMode()
const { isAutoTimeEnabled } = useAutoTheme()

const themeTitle = computed(() => {
  if (colorMode.preference === 'system') return 'Changer en clair'
  if (colorMode.preference === 'light') return 'Changer en sombre'
  if (colorMode.preference === 'dark') return 'Laisser le système'
  return 'Changer de thème'
})

const toggleTheme = () => {
  const modes = ['system', 'light', 'dark']
  const currentIndex = modes.indexOf(colorMode.preference)
  const nextIndex = (currentIndex + 1) % modes.length

  // Si l'utilisateur change manuellement, désactiver l'heure automatique
  if (process.client) {
    const isAutoTime = localStorage.getItem('cps_theme_auto_time')
    if (isAutoTime === 'true') {
      localStorage.setItem('cps_theme_auto_time', 'false')
      // Optionnel : déclencher un event pour Appearance.vue si nécessaire
      window.dispatchEvent(new Event('theme-manual-override'))
    }
  }

  colorMode.preference = modes[nextIndex]
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
