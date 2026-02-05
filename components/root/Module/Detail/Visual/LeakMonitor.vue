<template>
  <UiAppFrame type="browser" url="https://monitor.cypass.bj/dashboard" :glass="true"
    class="shadow-2xl shadow-blue-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
    <div class="h-[400px] md:h-[500px] bg-bgClr flex flex-col">
      <!-- Barre d'outils -->
      <div class="h-10 md:h-12 border-b border-ash flex items-center px-4 gap-2 md:gap-4 bg-WtB">
        <div class="px-2 md:px-3 py-1 bg-ash rounded text-[9px] md:text-xs text-slate-500">Filtre: Toutes Sources
        </div>
        <div
          class="px-2 md:px-3 py-1 bg-danger/20 text-danger rounded text-[9px] md:text-xs font-bold uppercase tracking-tighter sm:tracking-normal">
          Risque Élevé</div>
      </div>

      <!-- Contenu -->
      <div class="p-3 md:p-4 space-y-3 overflow-hidden">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-2 md:mb-4">
          <div class="p-3 md:p-4 bg-WtB rounded-lg shadow-sm border border-ash text-center">
            <div class="text-xl md:text-2xl font-bold text-BtW">0</div>
            <div class="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-tighter sm:tracking-normal">Fuites
              Actives</div>
          </div>
          <div class="p-3 md:p-4 bg-WtB rounded-lg shadow-sm border border-ash text-center">
            <div class="text-xl md:text-2xl font-bold text-BtW">124</div>
            <div class="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-tighter sm:tracking-normal">
              Documents</div>
          </div>
          <div
            class="col-span-2 p-3 md:p-4 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-sm text-WtB flex items-center justify-between px-4 md:px-6">
            <div>
              <div class="font-bold text-xs md:text-base">Protection active</div>
              <div class="text-[9px] md:text-xs opacity-80">Scan : il y a 2 min</div>
            </div>
            <IconShieldCheck class="w-6 h-6 md:w-8 md:h-8 opacity-80" />
          </div>
        </div>

        <!-- Lignes Fictives -->
        <div v-for="i in 4" :key="i"
          class="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
          <div class="w-6 h-6 md:w-8 md:h-8 bg-ash rounded flex items-center justify-center text-slate-400">
            <IconFileText class="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="h-1.5 md:h-2 bg-ash rounded w-1/3 mb-1"></div>
            <div class="h-1.5 md:h-2 bg-ashAct rounded w-1/4"></div>
          </div>
          <div
            class="px-1.5 md:px-2 py-0.5 md:py-1 bg-green-100 text-green-600 text-[8px] md:text-[10px] rounded font-bold">
            SÉCURISÉ</div>
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconFileText, IconShieldCheck } from '@tabler/icons-vue'
</script>
