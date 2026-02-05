<template>
  <div class="grid md:grid-cols-3 gap-6 md:gap-8">
    <div v-for="(category, index) in categories" :key="index"
      class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl hover:scale-[1.01] transition-transform duration-300 cursor-pointer group animate-fade-up border border-ash/50"
      :style="{ animationDelay: `${index * 100}ms` }">
      <div
        class="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-xl shadow-lg"
        :class="category.colorClass">
        <component :is="category.icon" class="w-6 h-6 md:w-7 md:h-7" />
      </div>
      <h3 class="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">
        {{ category.title }}</h3>
      <p class="text-hsa text-sm leading-relaxed mb-4 md:mb-6">{{ category.desc }}</p>
      <span class="text-primary text-xs md:text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
        Explorer
        <IconArrowRight class="w-3.5 h-3.5 md:w-4 md:h-4" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'

defineProps<{
  categories: any[]
}>()
</script>
