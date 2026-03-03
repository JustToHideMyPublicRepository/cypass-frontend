<template>
  <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-WtB border border-ash shadow-sm">
    <div class="flex flex-col">
      <span class="text-[10px] uppercase font-bold text-textClr/50 tracking-widest">Score Actuel</span>
      <span class="text-2xl font-heading font-black text-primary">{{ score }}</span>
    </div>
    <div class="h-10 w-[1px] bg-ash"></div>
    <div class="flex flex-col items-end">
      <span class="text-[10px] uppercase font-bold text-textClr/50 tracking-widest">Meilleur Record</span>
      <span class="text-2xl font-heading font-black text-secondary">{{ highScore }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const { score, highScore, gameState, timer } = inject<any>('quiz-state')
</script>
