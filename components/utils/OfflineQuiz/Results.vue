<template>
  <div class="card text-center space-y-8 animate-fade-in">
    <div class="relative inline-block">
      <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
      <div
        class="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto shadow-xl transform rotate-3">
        <IconTrophy class="w-12 h-12 text-white" />
      </div>
    </div>

    <div class="space-y-2">
      <h2 class="text-3xl font-black text-hsaAct">Félicitations !</h2>
      <p class="text-textClr/70">Vous avez terminé le CYPASS Quiz.</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 rounded-2xl bg-ash/30 border border-ashAct">
        <span class="block text-[10px] uppercase font-bold text-textClr/50 mb-1">Score Final</span>
        <span class="text-3xl font-black text-primary">{{ score }}</span>
      </div>
      <div class="p-4 rounded-2xl bg-ash/30 border border-ashAct">
        <span class="block text-[10px] uppercase font-bold text-textClr/50 mb-1">Questions</span>
        <span class="text-3xl font-black text-secondary">{{ score / 10 }}/{{ totalQuestions }}</span>
      </div>
    </div>

    <button @click="$emit('reset')" class="btn btn-secondary w-full">
      Rejouer pour s'améliorer
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconTrophy } from '@tabler/icons-vue'

defineProps<{
  score: number,
  totalQuestions: number
}>()

defineEmits(['reset'])
</script>
