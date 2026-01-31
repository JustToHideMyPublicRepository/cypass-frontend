<template>
  <UiAppFrame type="card" class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1"
    :glass="true">
    <div class="relative h-[350px] overflow-hidden bg-WtB flex items-center justify-center">
      <!-- Radar Background -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-success)_1px,transparent_1px)] opacity-20 bg-[length:24px_24px]">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-WtB/50 to-WtB"></div>

      <!-- Radar Circles -->
      <div class="absolute w-[400px] h-[400px] border border-success/30 rounded-full"></div>
      <div class="absolute w-[300px] h-[300px] border border-success/20 rounded-full"></div>
      <div class="absolute w-[200px] h-[200px] border border-success/40 rounded-full animate-pulse"></div>

      <!-- Scanning Line -->
      <div
        class="absolute w-[200px] h-[200px] bg-gradient-to-tr from-transparent to-success/20 rounded-full animate-spin-slow origin-bottom-left"
        style="transform-origin: center;"></div>

      <!-- Alert Points -->
      <div class="absolute top-[30%] left-[60%] w-3 h-3 bg-danger rounded-full animate-ping"></div>
      <div class="absolute top-[30%] left-[60%] w-3 h-3 bg-danger rounded-full"></div>

      <div class="absolute bottom-[40%] right-[30%] w-2 h-2 bg-warning rounded-full animate-pulse"></div>

      <!-- Overlay Text -->
      <div class="absolute bottom-6 left-6 right-6 p-4 bg-ash/90 backdrop-blur-sm rounded-xl border border-ashAct">
        <div class="flex items-center gap-3">
          <IconRadar2 class="w-6 h-6 text-success animate-spin-slow" />
          <div>
            <div class="text-xs font-bold text-BtW uppercase tracking-wider">Menace Détectée</div>
            <div class="text-[10px] text-hsa font-code">IP: 192.168.X.X • Port Scan Multiples</div>
          </div>
          <button
            class="ml-auto px-3 py-1 bg-danger/10 text-danger text-xs font-bold rounded hover:bg-danger/20">Bloquer</button>
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconRadar2 } from '@tabler/icons-vue'
</script>
