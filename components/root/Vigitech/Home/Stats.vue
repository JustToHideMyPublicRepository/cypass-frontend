<template>
  <div class="space-y-4">
    <h3 class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] px-2">Rapport Hebdomadaire</h3>

    <!-- Stat Cards -->
    <div v-for="stat in stats" :key="stat.label"
      class="p-5 rounded-[1.8rem] border border-ashAct shadow-sm overflow-hidden relative group" :class="stat.bg">
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-2">
          <p
            class="text-[9px] font-black uppercase tracking-widest text-hsa opacity-80 group-hover:text-BtW transition-colors">
            {{ stat.label }}</p>
          <component :is="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
        </div>
        <div class="flex items-end gap-3">
          <h4 class="text-2xl font-black text-BtW transition-transform group-hover:scale-105 duration-500">{{
            stat.value
          }}</h4>
          <div v-if="stat.trend"
            class="flex items-center gap-1 mb-1 px-1.5 py-0.5 rounded-full bg-ash/50 text-[8px] font-black">
            <component :is="stat.trend >= 0 ? IconTrendingUp : IconTrendingDown" class="w-2.5 h-2.5"
              :class="stat.trend >= 0 ? 'text-success' : 'text-danger'" />
            <span :class="stat.trend >= 0 ? 'text-success' : 'text-danger'">{{ Math.abs(stat.trend) }}%</span>
          </div>
        </div>
        <p class="text-[10px] font-bold text-hsa mt-1">{{ stat.sub }}</p>
      </div>
      <div
        class="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-primary/5 transition-all duration-700">
      </div>
    </div>

    <!-- Small AI Report -->
    <div class="glass-panel p-6 rounded-[2rem] border border-ashAct space-y-4 bg-hsa">
      <div class="flex items-center gap-2">
        <IconSparkles class="w-4 h-4 text-primary" />
        <span class="text-[10px] font-black uppercase tracking-widest text-WtB">Analyse VIGIAI</span>
      </div>
      <p class="text-[11px] font-medium text-ash leading-relaxed italic">
        "Cette semaine, nous observons une recrudescence des campagnes de <strong>{{ topThreatType }}</strong>.
        La vigilance est de mise sur les <strong>{{ topTarget }}</strong>."
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTrendingUp, IconTrendingDown, IconSparkles } from '@tabler/icons-vue'

defineProps<{
  stats: any[]
  topThreatType: string
  topTarget: string
}>()
</script>
