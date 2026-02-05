<template>
  <div class="space-y-4 md:space-y-6 animate-fade-right">
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
      :class="service.theme === 'blue'
        ? 'bg-primary/10 text-primary border-primary/20'
        : 'bg-success/10 text-success border-success/20'">
      <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse"
        :class="service.theme === 'blue' ? 'bg-primary' : 'bg-success'"></span>
      Module {{ service.status === 'available' ? 'Actif' : 'En Développement' }}
    </div>

    <h1 class="text-4xl md:text-7xl font-black leading-tight tracking-tight">
      {{ service.title }}<span class="text-primary">.</span>
    </h1>

    <p class="text-lg md:text-2xl text-hsa leading-relaxed font-light">
      {{ service.fullDescription }}
    </p>

    <div v-if="service.status === 'available'" class="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
      <UiBaseButton class="shadow-xl shadow-primary/20 w-full sm:w-auto">
        Demander une démo
        <IconArrowRight class="w-5 h-5 ml-2" />
      </UiBaseButton>
      <UiBaseButton variant="secondary" class="w-full sm:w-auto">
        <IconFileText class="w-5 h-5 mr-2" />
        Documentation API
      </UiBaseButton>
    </div>
    <div v-else class="pt-4">
      <div
        class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-ash text-slate-500 font-bold border border-ash text-sm md:text-base">
        <IconClock class="w-5 h-5" />
        Disponible prochainement
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconFileText, IconClock } from '@tabler/icons-vue'

defineProps<{
  service: any
}>()
</script>
