<template>
  <div class="py-12 animate-fade-in max-w-2xl mx-auto w-full">
    <div
      class="p-6 md:p-8 bg-primary/5 rounded-[32px] md:rounded-[40px] border-2 border-primary/10 shadow-xl shadow-primary/5 text-left overflow-hidden">
      <p
        class="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em] md:tracking-widest mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
        <span class="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-primary"></span>
        </span>
        Analyse Cryptographique en cours...
      </p>
      <UtilsStepProgress :steps="steps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Step } from '~/utils/docsentry'

defineProps<{
  steps: Step[]
}>()
</script>
