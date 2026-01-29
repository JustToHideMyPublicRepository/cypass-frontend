<template>
  <div class="mb-12 p-6 rounded-3xl bg-primary/5 border border-primary/20 animate-fade-up shadow-sm">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
        <IconBolt class="w-6 h-6" />
      </div>
      <div>
        <h3 class="font-bold text-BtW text-lg mb-1">Mode Expert & Raccourcis</h3>
        <div class="space-y-4 text-hsa text-sm leading-relaxed mb-4">
          <p>
            <strong class="text-BtW">Navigation (ALT) :</strong> Appuyez une fois sur <kbd
              class="kbd-base py-0.5 px-1.5 min-w-0">ALT</kbd> pour activer le mode navigation. Tapez ensuite la
            séquence
            de touches (ex: <kbd class="kbd-base py-0 px-1 min-w-0 mx-0.5">L</kbd> puis <kbd
              class="kbd-base py-0 px-1 min-w-0 mx-0.5">M</kbd>) pour accéder rapidement à une page.
          </p>
          <p>
            <strong class="text-BtW">Actions Directes :</strong> Sur certains boutons (modales de confirmation,
            suppression, etc.), des touches uniques s'affichent directement (<kbd
              class="kbd-base py-0.5 px-1.5 min-w-0">Y</kbd>, <kbd class="kbd-base py-0.5 px-1.5 min-w-0">N</kbd>, <kbd
              class="kbd-base py-0.5 px-1.5 min-w-0">↵</kbd>). Ces touches agissent instantanément sans passer par le
            mode ALT.
          </p>
        </div>
        <div
          class="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-full">
          <IconInfoCircle class="w-4 h-4" />
          <span>Appuyez sur Echap ou cliquez n'importe où pour quitter un mode actif</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconBolt, IconInfoCircle } from '@tabler/icons-vue'
</script>

<style scoped>
.kbd-base {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-BtW);
  color: var(--color-WtB);
  border: 1px solid var(--color-ash);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 0 0 var(--color-hsa);
  min-width: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
