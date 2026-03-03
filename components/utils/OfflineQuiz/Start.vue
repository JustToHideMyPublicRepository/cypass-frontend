<template>
  <div class="card p-8 text-center space-y-8 animate-fade-in relative overflow-hidden group">
    <!-- Icon Decor -->
    <div class="relative inline-block">
      <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
      <div
        class="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg transform group-hover:rotate-6 transition-transform">
        <IconDeviceGamepad2 class="w-10 h-10 text-white" />
      </div>
    </div>

    <div class="space-y-3">
      <h2 class="text-3xl font-black text-hsaAct">CYPASS Quiz</h2>
      <p class="text-textClr/70 text-sm max-w-sm mx-auto">
        La connexion est perdue ? Profitez-en pour tester vos connaissances en cybersécurité et battre votre record !
      </p>
    </div>

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
import { IconDeviceGamepad2, IconCircleCheck, IconHourglass } from '@tabler/icons-vue'

const { initializeGame } = inject<any>('quiz-state')
</script>
