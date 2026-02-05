<template>
  <div class="text-center mb-12 animate-fade-up">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
      <IconKeyboard class="w-10 h-10" />
    </div>
    <h1 class="text-4xl font-black tracking-tight mb-4">Raccourcis Clavier</h1>
    <p class="text-lg text-hs">Naviguez plus rapidement sur CYPASS grâce à nos raccourcis.</p>

    <!-- Settings Trigger -->
    <UiBaseButton @click="$emit('open-settings')" variant="ghost"
      class="mt-6 !inline-flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-ash/50 border border-ashAct text-hsa hover:!text-primary hover:!border-primary/50 transition-all !text-sm !font-bold !h-auto">
      <IconSettings class="w-4 h-4" />
      Configurer mes raccourcis
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconKeyboard, IconSettings } from '@tabler/icons-vue'

defineEmits(['open-settings'])
</script>
