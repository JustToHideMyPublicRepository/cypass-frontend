<template>
  <UiBaseButton @click="toggleTheme" variant="ghost"
    class="!relative !p-2 !rounded-full hover:!bg-ash transition-colors duration-300 !h-auto !w-auto border-none"
    aria-label="Toggle Theme">
    <Transition name="fade" mode="out-in">
      <IconSun v-if="colorMode.value === 'dark'" class="w-5 h-5 text-yellow-500" />
      <IconMoon v-else class="w-5 h-5 text-slate-600" />
    </Transition>
  </UiBaseButton>
</template>

<script setup lang="ts">
import { IconSun, IconMoon } from '@tabler/icons-vue'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
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
