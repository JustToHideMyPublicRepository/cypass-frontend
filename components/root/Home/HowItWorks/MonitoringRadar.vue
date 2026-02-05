<template>
  <div
    class="bg-slate-900 rounded-xl shadow-2xl border border-slate-700/50 p-4 h-[213px] relative overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-success/20">

    <!-- Arrière-plan de la grille radar -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.slate.800)_1px,transparent_1px)] bg-[length:10px_10px] opacity-20">
    </div>

    <!-- Radar rotatif -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-32 h-32 rounded-full border border-success/30 relative">
        <div class="absolute inset-0 rounded-full border border-success/10 animate-[ping_3s_linear_infinite]">
        </div>
        <div
          class="absolute w-full h-full rounded-full bg-gradient-to-r from-transparent via-success/10 to-transparent animate-spin-slow opacity-50">
        </div>
      </div>
    </div>

    <!-- Interface UI Superposée -->
    <div class="relative z-10 h-full flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <div class="text-[10px] font-code text-success/80">SYSTEM_ACTIVE</div>
        <IconWifi class="w-4 h-4 text-success animate-pulse" />
      </div>

      <div class="space-y-2 font-code text-[10px]">
        <div class="flex justify-between text-slate-400">
          <span>UPTIME</span>
          <span class="text-white">99.99%</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>LATENCY</span>
          <span class="text-white">12ms</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>THREATS</span>
          <span class="text-success">0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconWifi } from '@tabler/icons-vue'
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
