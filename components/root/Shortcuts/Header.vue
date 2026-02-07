<template>
  <div class="text-center mb-8 md:mb-12 animate-fade-up">
    <div
      class="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 text-primary mb-4 md:mb-6">
      <IconKeyboard class="w-8 h-8 md:w-10 md:h-10" />
    </div>
    <h1 class="text-3xl md:text-4xl font-black tracking-tight mb-3 md:mb-4">Raccourcis Clavier</h1>
    <p class="text-base md:text-lg text-hs">Naviguez plus rapidement sur CYPASS grâce à nos raccourcis.</p>

    <!-- Boutons modaux -->
    <div class="flex flex-wrap justify-center gap-3 mt-4 md:mt-6">
      <UiBaseButton @click="$emit('open-settings')" variant="ghost"
        class="!inline-flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-ash/50 border border-ashAct text-hsa hover:!text-primary hover:!border-primary/50 transition-all !text-xs md:!text-sm !font-bold !h-auto">
        <IconSettings class="w-4 h-4" />
        Configurer mes raccourcis
      </UiBaseButton>

      <UiBaseButton @click="$emit('open-expert')" variant="ghost"
        class="!inline-flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-ash/50 border border-ashAct text-hsa hover:!text-primary hover:!border-primary/50 transition-all !text-xs md:!text-sm !font-bold !h-auto">
        <IconBolt class="w-4 h-4" />
        Documentation expert
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconKeyboard, IconSettings, IconBolt } from '@tabler/icons-vue'

defineEmits(['open-settings', 'open-expert'])
</script>
