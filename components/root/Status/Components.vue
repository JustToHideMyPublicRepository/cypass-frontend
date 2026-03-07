<template>
  <div class="space-y-3 md:space-y-4 animate-fade-up" style="animation-delay: 100ms">
    <h3 class="text-base md:text-lg font-bold pl-2">Composants</h3>

    <div v-for="component in components" :key="component.name"
      class="glass-panel p-4 md:px-6 rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border border-ash/50">
      <span class="font-medium text-sm md:text-base">{{ component.name }}</span>
      <div class="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span class="text-xs font-bold" :class="component.statusColor">{{ component.statusLabel }}</span>
        <div class="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" :class="component.dotColor"
          :style="{ boxShadow: component.shadow }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  components: Array<{
    name: string
    statusLabel: string
    statusColor: string
    dotColor: string
    shadow: string
  }>
}>()
</script>
