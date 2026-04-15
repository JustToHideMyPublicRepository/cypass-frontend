<template>
  <UiAppFrame type="card" :glass="true"
    class="shadow-2xl shadow-green-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
    <div class="relative h-[400px] md:h-[500px] bg-slate-900 overflow-hidden flex flex-col">
      <!-- Grille/Radar BG -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.slate.800)_1px,transparent_1px)] bg-[length:30px_30px] md:bg-[length:40px_40px] opacity-20">
      </div>
      <div
        class="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,theme(colors.green.500/0.1)_360deg)] animate-spin-slow">
      </div>

      <!-- En-tête -->
      <div
        class="p-3 md:p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md z-10">
        <div class="flex items-center gap-2 text-green-500 font-code text-[10px] md:text-xs">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SURVEILLANCE LIVE
        </div>
        <div class="text-[10px] md:text-xs text-slate-500 font-code">LATENCE: 12ms</div>
      </div>

      <!-- Radar Central -->
      <div class="flex-grow relative flex items-center justify-center">
        <div
          class="w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-green-500/20 rounded-full flex items-center justify-center relative">
          <div
            class="w-[140px] h-[140px] md:w-[200px] md:h-[200px] border border-green-500/40 rounded-full flex items-center justify-center">
            <div
              class="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border border-green-500/60 rounded-full flex items-center justify-center bg-green-500/5">
              <IconRadar2 class="w-8 h-8 md:w-10 md:h-10 text-green-500 animate-pulse" />
            </div>
          </div>
          <!-- Points d'Alerte -->
          <div class="absolute top-[20%] right-[30%] w-2 h-2 md:w-3 md:h-3 bg-danger rounded-full animate-ping"></div>
          <div class="absolute bottom-[20%] left-[30%] w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
          </div>
        </div>
      </div>

      <!-- Flux de Menaces -->
      <div class="h-[120px] md:h-[150px] bg-slate-950 border-t border-slate-800 p-3 md:p-4 space-y-2 z-10">
        <div
          class="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest mb-1 md:mb-2 text-center md:text-left">
          Alertes Récentes</div>
        <div
          class="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-300 p-2 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-danger">
          <span class="font-code text-danger">CRITIQUE</span>
          <span class="truncate">Tentative DDoS detectée - Port 443</span>
          <span class="ml-auto text-slate-600 hidden sm:inline">Maintenant</span>
        </div>
        <div
          class="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-300 p-2 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-yellow-500">
          <span class="font-code text-warning">ALERTE</span>
          <span class="truncate">Connexion IP inhabituelle (45.2.X.X)</span>
          <span class="ml-auto text-slate-600 hidden sm:inline">Il y a 2m</span>
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconRadar2 } from '@tabler/icons-vue'
</script>
