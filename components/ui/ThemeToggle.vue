<template>
  <div class="relative">
    <UiBaseButton @click="handleToggleRequest" variant="ghost"
      class="!relative !p-2 !rounded-full hover:!bg-ash transition-colors duration-300 !h-auto !w-auto"
      :title="themeTitle" aria-label="Toggle Theme">
      <Transition name="fade" mode="out-in">
        <IconDeviceDesktop v-if="colorMode.preference === 'system'" class="w-5 h-5 text-primary" />
        <IconSun v-else-if="colorMode.preference === 'light'" class="w-5 h-5 text-yellow-500" />
        <IconMoon v-else class="w-5 h-5 text-slate-600" />
      </Transition>

      <!-- Indicateur d'heure automatique (Badge) -->
      <div v-if="isAutoTimeEnabled"
        class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-WtB shadow-sm border border-ash text-primary">
        <IconBrightnessAuto class="w-3.5 h-3.5 animate-pulse" />
      </div>
    </UiBaseButton>

    <!-- Modal de confirmation pour désactiver l'auto-thème -->
    <UiConfirmModal :show="showConfirm" title="Désactiver l'automatisme ?"
      message="Vous allez changer le thème manuellement, ce qui désactivera la planification automatique. Voulez-vous continuer ?"
      confirm-text="Changer" cancel-text="Garder" variant="primary" :icon="IconAlertTriangle" @confirm="confirmOverride"
      @cancel="showConfirm = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, markRaw } from 'vue'
import { IconSun, IconMoon, IconDeviceDesktop, IconBrightnessAuto, IconAlertTriangle } from '@tabler/icons-vue'
import { useAutoTheme } from '~/composables/useAutoTheme'

const colorMode = useColorMode()
const { isAutoTimeEnabled, savePreference } = useAutoTheme()
const showConfirm = ref(false)

const themeTitle = computed(() => {
  let base = ''
  if (colorMode.preference === 'system') base = 'Changer en clair'
  else if (colorMode.preference === 'light') base = 'Changer en sombre'
  else if (colorMode.preference === 'dark') base = 'Laisser le système'
  else base = 'Changer de thème'

  return isAutoTimeEnabled.value ? `${base} (Géré par planification auto)` : base
})

const handleToggleRequest = () => {
  if (isAutoTimeEnabled.value) {
    showConfirm.value = true
  } else {
    executeToggle()
  }
}

const confirmOverride = () => {
  savePreference(false)
  showConfirm.value = false
  executeToggle()
  // Déclencher un event pour synchroniser Appearance.vue si nécessaire (déjà géré par le watch dans useAutoTheme)
  window.dispatchEvent(new Event('theme-manual-override'))
}

const executeToggle = () => {
  const modes = ['system', 'light', 'dark']
  const currentIndex = modes.indexOf(colorMode.preference)
  const nextIndex = (currentIndex + 1) % modes.length
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
