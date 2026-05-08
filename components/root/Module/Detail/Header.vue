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

    <h2> {{ service.title }}<span class="text-primary">.</span> </h2>

    <p> {{ service.fullDescription }} </p>

    <div v-if="service.status === 'available'" class="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
      <UiBaseButton variant="primary">
        Demander une démo
        <IconArrowRight class="w-5 h-5 ml-2" />
      </UiBaseButton>
      <UiBaseButton variant="secondary">
        <IconFileText class="w-5 h-5 mr-2" />
        Documentation API
      </UiBaseButton>
    </div>
    <div v-else class="pt-4">
      <UiBaseButton variant="ghost" class="gap-3 opacity-50">
        <IconClock class="w-5 h-5" />
        Disponible prochainement
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconFileText, IconClock } from '@tabler/icons-vue'

defineProps<{
  service: any
}>()
</script>
