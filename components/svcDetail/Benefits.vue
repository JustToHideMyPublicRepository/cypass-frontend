<template>
  <div class="grid sm:grid-cols-2 gap-6">
    <div v-for="(benefit, index) in benefits" :key="index"
      class="glass-panel p-6 rounded-2xl animate-fade-up border border-ash/50 group hover:border-primary/20 transition-colors"
      :style="{ animationDelay: `${index * 100}ms` }">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300"
        :class="theme === 'blue' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'">
        <IconCheck class="w-5 h-5" />
      </div>
      <h3 class="font-bold text-lg mb-2">{{ benefit.title }}</h3>
      <p class="text-hsa text-sm leading-relaxed">{{ benefit.qty }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import type { ServiceBenefit } from '@/data/services'

defineProps<{
  benefits: ServiceBenefit[]
  theme: string
}>()
</script>
