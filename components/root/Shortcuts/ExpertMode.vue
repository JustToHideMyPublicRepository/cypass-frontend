<template>
  <div
    class="mb-8 md:mb-12 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-primary/5 border border-primary/20 animate-fade-up shadow-sm">
    <div class="flex items-start gap-4">
      <div
        class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
        <IconBolt class="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div>
        <h3 class="font-bold text-BtW text-base md:text-lg mb-1">Mode Expert & Raccourcis</h3>
        <div class="space-y-4 text-hsa text-sm leading-relaxed mb-4">
          <p class="text-xs md:text-sm">
            <strong class="text-BtW">Navigation (ALT) :</strong> Appuyez une fois sur <kbd class="kbd-hint">ALT</kbd>
            pour activer le mode navigation. Tapez ensuite la
            séquence
            de touches (ex: <kbd class="kbd-hint mx-0.5">L</kbd> puis <kbd class="kbd-hint mx-0.5">M</kbd>) pour accéder
            rapidement à une page.
          </p>
          <p class="text-xs md:text-sm">
            <strong class="text-BtW">Actions Directes :</strong> Sur certains boutons (modales de confirmation,
            suppression, etc.), des touches uniques s'affichent directement (<kbd class="kbd-hint">Y</kbd>, <kbd
              class="kbd-hint">N</kbd>, <kbd class="kbd-hint">↵</kbd>). Ces touches agissent instantanément sans passer
            par le
            mode ALT.
          </p>
        </div>
        <div
          class="flex items-start md:items-center gap-2 text-[10px] md:text-xs font-bold text-primary bg-primary/10 w-fit px-3 py-2 md:py-1.5 rounded-lg md:rounded-full">
          <IconInfoCircle class="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 mt-0.5 md:mt-0" />
          <span>Appuyez sur Echap ou cliquez n'importe où pour quitter un mode actif</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconBolt, IconInfoCircle } from '@tabler/icons-vue'
</script>
