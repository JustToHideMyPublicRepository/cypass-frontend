<template>
  <div class="grid md:grid-cols-3 gap-8">
    <div v v-for="(category, index) in categories" :key="index"
      class="glass-panel p-8 rounded-3xl hover:scale-[1.01] transition-transform duration-300 cursor-pointer group animate-fade-up border border-ash/50"
      :style="{ animationDelay: `${index * 100}ms` }">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg"
        :class="category.colorClass">
        <component :is="category.icon" class="w-7 h-7" />
      </div>
      <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
        {{ category.title }}</h3>
      <p class="text-hsa text-sm leading-relaxed mb-6">{{ category.desc }}</p>
      <span class="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
        Explorer
        <IconArrowRight class="w-4 h-4" />
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
