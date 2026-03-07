<template>
  <div
    class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl animate-fade-up border-l-4 flex flex-col sm:flex-row items-center gap-4 md:gap-6 shadow-lg"
    :class="[status.borderColor, status.shadowColor]">
    <div class="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center animate-pulse shrink-0"
      :class="[status.bgColor, status.textColor]">
      <component :is="status.icon" class="w-6 h-6 md:w-8 md:h-8" />
    </div>
    <div>
      <h2 class="text-xl md:text-2xl font-bold leading-tight">{{ status.message }}</h2>
      <p class="text-sm md:text-base text-hsa mt-1">Dernière mise à jour : {{ lastUpdate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  status: {
    borderColor: string
    shadowColor: string
    bgColor: string
    textColor: string
    icon: any
    message: string
  }
  lastUpdate: string
}>()
</script>
