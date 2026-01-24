<template>
  <div class="space-y-24">
    <!-- Hero Section -->
    <div class="text-center space-y-6 animate-fade-up relative">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ash border border-ash backdrop-blur-sm mb-4">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span class="text-xs font-bold uppercase tracking-widest text-hsa">Catalogue de
          Services v2.0</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
        Solutions de <br class="md:hidden" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-success to-secondary relative">
          Confiance Numérique
          <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30 hidden md:block" viewBox="0 0 200 9"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.00025 6.99997C25.7509 9.37523 78.9113 9.81705 112.225 4.88566C145.539 -0.0457375 186.257 0.999738 198.001 2.99996"
              stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
        </span>
      </h1>
      <p class="text-xl text-hsa max-w-2xl mx-auto leading-relaxed font-light">
        Une suite complète d'outils souverains pour sécuriser, certifier et surveiller votre écosystème numérique.
      </p>
    </div>

    <!-- Trust Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-ash/50 backdrop-blur-sm animate-fade-up"
      style="animation-delay: 100ms;">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="text-3xl font-bold mb-1">{{ stat.value }}</div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-slate-500">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '100%', label: 'Conformité' },
  { value: '24/7', label: 'Surveillance' },
  { value: 'SHA-256', label: 'Chiffrement' },
  { value: 'ISO', label: 'Certifié' },
]
</script>
