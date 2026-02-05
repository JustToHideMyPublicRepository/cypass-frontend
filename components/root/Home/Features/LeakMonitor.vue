<template>
  <UiAppFrame type="browser" url="https://monitor.cypass.bj/alerts"
    class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1" :glass="true"
    padding="p-2 md:p-4">
    <div class="h-[300px] md:h-[350px] bg-bgClr p-3 md:p-4 overflow-hidden relative">
      <!-- Statistiques d'en-tête -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4">
        <div class="bg-WtB p-2 md:p-3 rounded-lg shadow-sm border border-ash">
          <div class="text-[9px] md:text-[10px] text-hsa uppercase tracking-tight">Fuites</div>
          <div class="text-sm md:text-lg font-bold text-danger">0</div>
        </div>
        <div class="bg-WtB p-2 md:p-3 rounded-lg shadow-sm border border-ash">
          <div class="text-[9px] md:text-[10px] text-hsa uppercase tracking-tight">Sources</div>
          <div class="text-sm md:text-lg font-bold text-BtW">142</div>
        </div>
        <div
          class="bg-WtB p-2 md:p-3 rounded-lg shadow-sm border border-ash col-span-2 md:col-span-1 flex md:block items-center justify-between">
          <div class="text-[9px] md:text-[10px] text-hsa uppercase tracking-tight">Statut</div>
          <div class="text-sm md:text-lg font-bold text-success uppercase">Actif</div>
        </div>
      </div>

      <!-- Liste de fichiers -->
      <div class="space-y-2">
        <div v-for="i in 4" :key="i"
          class="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-WtB rounded-lg border border-ash shadow-sm">
          <div :class="i === 1 ? 'bg-danger/10 text-danger' : 'bg-ash text-hsa'"
            class="w-7 h-7 md:w-8 md:h-8 rounded flex items-center justify-center flex-shrink-0">
            <IconFileReport class="w-4 h-4" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[10px] md:text-xs font-bold truncate">CONFIDENTIEL_RAPPORT_{{
              2023 + i
            }}.pdf</div>
            <div class="text-[8px] md:text-[10px] text-hsa truncate">Detecté sur Pastebin • Il y a {{ i * 5 }} min</div>
          </div>
          <div v-if="i === 1" class="px-1.5 py-0.5 bg-danger text-white text-[8px] md:text-[10px] font-bold rounded">
            CRITIQUE
          </div>
          <div v-else class="px-1.5 py-0.5 bg-success/20 text-success text-[8px] md:text-[10px] font-bold rounded">
            SECURISE</div>
        </div>
      </div>

      <!-- Superposition de dégradé pour la profondeur -->
      <div class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-bgClr to-transparent">
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconFileReport } from '@tabler/icons-vue'
</script>
