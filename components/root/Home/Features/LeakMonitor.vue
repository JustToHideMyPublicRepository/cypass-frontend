<template>
  <UiAppFrame type="browser" url="https://monitor.cypass.bj/alerts"
    class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1" :glass="true">
    <div class="h-[350px] bg-bgClr p-4 overflow-hidden relative">
      <!-- Header Stats -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-WtB p-3 rounded-lg shadow-sm border border-ash">
          <div class="text-[10px] text-hsa uppercase">Fuites</div>
          <div class="text-lg font-bold text-danger">0</div>
        </div>
        <div class="bg-WtB p-3 rounded-lg shadow-sm border border-ash">
          <div class="text-[10px] text-hsa uppercase">Sources</div>
          <div class="text-lg font-bold text-BtW">142</div>
        </div>
        <div class="bg-WtB p-3 rounded-lg shadow-sm border border-ash">
          <div class="text-[10px] text-hsa uppercase">Status</div>
          <div class="text-lg font-bold text-success">Actif</div>
        </div>
      </div>

      <!-- File List -->
      <div class="space-y-2">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 bg-WtB rounded-lg border border-ash shadow-sm">
          <div :class="i === 1 ? 'bg-danger/10 text-danger' : 'bg-ash text-hsa'"
            class="w-8 h-8 rounded flex items-center justify-center">
            <IconFileReport class="w-4 h-4" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold truncate">CONFIDENTIEL_RAPPORT_{{
              2023 + i
            }}.pdf</div>
            <div class="text-[10px] text-hsa">Detecté sur Pastebin • Il y a {{ i * 5 }} min</div>
          </div>
          <div v-if="i === 1" class="px-2 py-0.5 bg-danger text-white text-[10px] font-bold rounded">KRITIK
          </div>
          <div v-else class="px-2 py-0.5 bg-success/20 text-success text-[10px] font-bold rounded">SECURE</div>
        </div>
      </div>

      <!-- Blur overlay for depth -->
      <div class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-bgClr to-transparent">
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconFileReport } from '@tabler/icons-vue'
</script>
