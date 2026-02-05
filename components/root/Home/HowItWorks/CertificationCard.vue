<template>
  <div
    class="bg-WtB rounded-xl shadow-2xl border border-ash p-1 relative overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-secondary/20 h-[213px]">
    <!-- Effet de balayage lumineux -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent -translate-y-full group-hover:animate-scan z-20 pointer-events-none">
    </div>

    <div class="h-full bg-bgClr rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
      <!-- En-tête de carte -->
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
            <IconKey class="w-5 h-5" />
          </div>
          <div>
            <div class="text-[10px] text-hsa uppercase font-bold tracking-wider">CYPASS ID</div>
            <div class="text-xs font-bold text-BtW">DocSentry Cert</div>
          </div>
        </div>
        <IconVersions class="w-8 h-8 text-ashAct" />
      </div>

      <!-- Puce -->
      <div class="my-4 flex items-center gap-4">
        <div
          class="w-10 h-8 rounded border border-ashAct bg-gradient-to-br from-yellow-200 to-yellow-400 relative overflow-hidden opacity-80">
          <div class="absolute inset-0 border-t border-b border-yellow-600/20 top-1/2 -translate-y-1/2"></div>
          <div class="absolute inset-0 border-l border-r border-yellow-600/20 left-1/2 -translate-x-1/2">
          </div>
        </div>
        <div class="font-code text-[10px] text-hsa tracking-tighter">
          KEY: 8F3A-29B1-XXXX<br>
          EXP: 12/2028
        </div>
      </div>

      <!-- Pied de page statut -->
      <div class="flex items-center justify-between border-t border-ash pt-3">
        <div class="flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span class="text-[10px] font-bold text-success uppercase">Vérifié</span>
        </div>
        <div class="text-[10px] text-hsa font-code">
          #CS-8812
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconKey, IconVersions } from '@tabler/icons-vue'
</script>

<style scoped>
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(200%);
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}
</style>
