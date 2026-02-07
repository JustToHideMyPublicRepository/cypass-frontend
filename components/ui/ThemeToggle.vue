<template>
  <UiBaseButton @click="toggleTheme" variant="ghost"
    class="!relative !p-2 !rounded-full hover:!bg-ash transition-colors duration-300 !h-auto !w-auto"
    aria-label="Toggle Theme">
    <Transition name="fade" mode="out-in">
      <IconDeviceDesktop v-if="colorMode.preference === 'system'" class="w-5 h-5 text-primary" />
      <IconSun v-else-if="colorMode.preference === 'light'" class="w-5 h-5 text-yellow-500" />
      <IconMoon v-else class="w-5 h-5 text-slate-600" />
    </Transition>
  </UiBaseButton>
</template>

<script setup lang="ts">
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-vue'

const colorMode = useColorMode()

const toggleTheme = () => {
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
