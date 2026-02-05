<template>
  <UiAppFrame type="card" class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1"
    :glass="true">
    <div class="relative h-[300px] md:h-[350px] overflow-hidden bg-WtB flex items-center justify-center">
      <!-- Arrière-plan Radar -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-success)_1px,transparent_1px)] opacity-40 bg-[length:20px_20px] md:bg-[length:24px_24px]">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-WtB/50 to-WtB"></div>

      <!-- Cercles du Radar -->
      <div class="absolute w-[300px] md:w-[400px] h-[300px] md:h-[400px] border border-success/30 rounded-full"></div>
      <div class="absolute w-[220px] md:w-[300px] h-[220px] md:h-[300px] border border-success/20 rounded-full"></div>
      <div
        class="absolute w-[140px] md:w-[200px] h-[140px] md:h-[200px] border border-success/40 rounded-full animate-pulse">
      </div>

      <!-- Ligne de Balayage -->
      <div
        class="absolute w-[140px] md:w-[200px] h-[140px] md:h-[200px] bg-gradient-to-tr from-transparent to-success/20 rounded-full animate-spin-slow origin-bottom-left"
        style="transform-origin: center;"></div>

      <!-- Points d'Alerte -->
      <div class="absolute top-[30%] left-[60%] w-2 md:w-3 h-2 md:h-3 bg-danger rounded-full animate-ping"></div>
      <div class="absolute top-[30%] left-[60%] w-2 md:w-3 h-2 md:h-3 bg-danger rounded-full"></div>

      <div class="absolute bottom-[40%] right-[30%] w-1.5 md:w-2 h-1.5 md:h-2 bg-warning rounded-full animate-pulse">
      </div>

      <!-- Texte de Superposition -->
      <div
        class="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-3 md:p-4 bg-ash/90 backdrop-blur-sm rounded-xl border border-ashAct">
        <div class="flex items-center gap-2 md:gap-3">
          <IconRadar2 class="w-5 h-5 md:w-6 md:h-6 text-success animate-spin-slow" />
          <div class="flex-1 min-w-0">
            <div class="text-[10px] md:text-xs font-bold text-BtW uppercase tracking-wider truncate">Menace Détectée
            </div>
            <div class="text-[8px] md:text-[10px] text-hsa font-code truncate">IP: 192.168.X.X • Port Scan</div>
          </div>
          <button
            class="px-2 md:px-3 py-1 bg-danger/10 text-danger text-[10px] md:text-xs font-bold rounded hover:bg-danger/20 transition-colors">Bloquer</button>
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconRadar2 } from '@tabler/icons-vue'
</script>
