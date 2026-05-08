<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
    <div v-for="(benefit, index) in benefits" :key="index"
      class="glass-panel p-5 md:p-6 rounded-2xl animate-fade-up border border-ash/50 group hover:border-primary/20 transition-colors"
      :style="{ animationDelay: `${index * 100}ms` }">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-colors group-hover:scale-110 duration-300"
        :class="theme === 'blue' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'">
        <IconCheck class="w-5 h-5" />
      </div>
      <h5 class="mb-1">{{ benefit.title }}</h5>
      <p class="text-hsa text-xs md:text-sm leading-relaxed">{{ benefit.qty }}</p>
      <div v-if="benefit.desc" class="mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium"
        :class="theme === 'blue' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'">
        {{ benefit.desc }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import type { ServiceBenefit } from '@/data/modules'

defineProps<{
  benefits: ServiceBenefit[]
  theme: string
}>()
</script>
