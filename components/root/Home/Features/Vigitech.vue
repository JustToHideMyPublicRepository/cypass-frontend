<template>
  <UiAppFrame type="card" class="transform-gpu transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] group"
    :glass="true">
    <div class="relative h-[300px] md:h-[350px] overflow-hidden bg-WtB flex items-center justify-center">
      <!-- Glow arrière-plan doux -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-success),0.05),transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <!-- Arrière-plan Radar -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--color-success),0.5)_1px,transparent_1px)] opacity-20 bg-[length:20px_20px] md:bg-[length:24px_24px]">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-WtB/70 to-WtB z-0"></div>

      <!-- Cercles du Radar (adoucies) -->
      <div class="absolute w-[300px] md:w-[400px] h-[300px] md:h-[400px] border border-success/10 rounded-full"></div>
      <div class="absolute w-[220px] md:w-[300px] h-[220px] md:h-[300px] border border-success/15 rounded-full"></div>
      <div
        class="absolute w-[140px] md:w-[200px] h-[140px] md:h-[200px] border border-success/20 rounded-full animate-pulse blur-[1px]">
      </div>

      <!-- Ligne de Balayage (plus douce) -->
      <div
        class="absolute w-[140px] md:w-[200px] h-[140px] md:h-[200px] bg-gradient-to-tr from-transparent via-success/5 to-success/15 rounded-full animate-spin-slow origin-bottom-left"
        style="transform-origin: center;"></div>

      <!-- Points d'Alerte (plus brillants) -->
      <div class="absolute top-[30%] left-[60%] w-2 md:w-3 h-2 md:h-3 bg-danger rounded-full animate-ping opacity-60"></div>
      <div class="absolute top-[30%] left-[60%] w-2 md:w-3 h-2 md:h-3 bg-danger rounded-full shadow-[0_0_10px_rgba(var(--color-danger),0.8)]"></div>

      <div class="absolute bottom-[40%] right-[30%] w-1.5 md:w-2 h-1.5 md:h-2 bg-warning rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--color-warning),0.8)]">
      </div>

      <!-- Texte de Superposition -->
      <div
        class="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-3 md:p-4 bg-bgClr/90 backdrop-blur-xl rounded-2xl border border-ash/40 shadow-xl transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out z-10">
        <div class="flex items-center gap-3">
          <IconRadar2 class="w-5 h-5 md:w-6 md:h-6 text-success animate-spin-slow" />
          <div class="flex-1 min-w-0">
            <div class="text-[10px] md:text-xs font-bold text-BtW uppercase tracking-wider truncate">Menace Détectée
            </div>
            <div class="text-[8px] md:text-[10px] text-hsa font-code truncate">IP: 192.168.X.X • Port Scan</div>
          </div>
          <UiBaseButton variant="ghost"
            class="!px-2 md:!px-3 !py-1 !bg-danger/10 !text-danger !text-[10px] md:!text-xs !font-bold !rounded hover:!bg-danger/20 transition-colors !h-auto !w-auto">
            Bloquer</UiBaseButton>
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconRadar2 } from '@tabler/icons-vue'
</script>
