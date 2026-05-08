<template>
  <div class="space-y-12 md:space-y-24">
    <!-- Section Hero -->
    <div class="text-center space-y-4 md:space-y-6 animate-fade-up relative">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ash border border-ash backdrop-blur-sm mb-2 md:mb-4">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-hsa">Catalogue de Services</span>
      </div>

      <h2> Solutions de <span class="text-primary font-handwritting">confiance numérique </span> </h2>
      <p> Une suite complète d'outils souverains pour sécuriser, certifier et surveiller votre écosystème numérique.
      </p>
    </div>

    <!-- Statistiques de Confiance -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-6 md:py-8 border-y border-hsa/50 backdrop-blur-sm animate-fade-up"
      style="animation-delay: 100ms;">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <h3>{{ stat.value }}</h3>
        <p>{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '100%', label: 'Conformité' },
  { value: '24/7', label: 'Surveillance' },
  { value: 'SHA-256', label: 'Chiffrement' },
  { value: '18004', label: 'ISO certifié' },
]
</script>
