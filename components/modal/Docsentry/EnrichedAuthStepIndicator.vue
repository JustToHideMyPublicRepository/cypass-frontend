<template>
  <div class="flex items-center justify-between mb-8 px-4">
    <div v-for="s in steps" :key="s.id" class="flex flex-col items-center gap-2 flex-1 relative">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10"
        :class="currentStep >= s.id ? 'bg-primary text-WtB shadow-lg shadow-primary/20' : 'bg-ash text-hsa'">
        {{ s.id }}
      </div>
      <span class="text-[10px] font-bold uppercase tracking-wider"
        :class="currentStep >= s.id ? 'text-primary' : 'text-hsa'">{{ s.label }}</span>
      <!-- Line -->
      <div v-if="s.id < steps.length" class="absolute top-4 left-1/2 w-full h-[2px] bg-ash -z-0">
        <div class="h-full bg-primary transition-all duration-500"
          :style="{ width: currentStep > s.id ? '100%' : '0%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: { id: number; label: string }[]
  currentStep: number
}>()
</script>
