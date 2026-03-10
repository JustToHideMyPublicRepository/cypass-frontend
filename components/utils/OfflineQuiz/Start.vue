<template>
  <div class="card p-8 text-center space-y-8 animate-fade-in relative overflow-hidden group">
    <div class="grid gap-4">
      <button @click="initializeGame('normal')"
        class="group/btn flex items-center p-4 rounded-2xl bg-ash/30 border-2 border-ashAct hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
        <div
          class="w-12 h-12 rounded-xl bg-ashAct/50 flex items-center justify-center group-hover/btn:bg-primary/20 transition-colors">
          <IconCircleCheck class="w-6 h-6 text-primary" />
        </div>
        <div class="ml-4">
          <span class="block font-bold text-hsaAct">Mode Classique</span>
          <span class="text-xs text-textClr/50">Prenez votre temps pour apprendre.</span>
        </div>
      </button>

      <button @click="initializeGame('time-attack')"
        class="group/btn flex items-center p-4 rounded-2xl bg-ash/30 border-2 border-ashAct hover:border-secondary/50 hover:bg-secondary/5 transition-all text-left">
        <div
          class="w-12 h-12 rounded-xl bg-ashAct/50 flex items-center justify-center group-hover/btn:bg-secondary/20 transition-colors">
          <IconHourglass class="w-6 h-6 text-secondary" />
        </div>
        <div class="ml-4">
          <span class="block font-bold text-hsaAct">Contre la montre</span>
          <span class="text-xs text-textClr/50">60 secondes pour un maximum de points !</span>
        </div>
      </button>
    </div>

    <p class="text-[10px] text-textClr/30 italic">
      Vos points seront sauvegardés localement.
    </p>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { IconCircleCheck, IconHourglass } from '@tabler/icons-vue'

const { initializeGame } = inject<any>('quiz-state')
</script>
