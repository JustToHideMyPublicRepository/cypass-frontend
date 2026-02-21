<template>
  <section class="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
    <!-- Section des statistiques clés -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
        <div v-for="(stat, index) in stats" :key="index" class="space-y-4 group">
          <div
            class="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter group-hover:scale-110 transition-transform duration-300">
            {{ stat.value }}
          </div>
          <div :class="`text-sm font-bold uppercase tracking-widest ${stat.colorClass}`">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  {
    value: '99.9%',
    label: 'Disponibilité',
    colorClass: 'text-primary'
  },
  {
    value: '5M+',
    label: 'Transactions/Mois',
    colorClass: 'text-secondary'
  },
  {
    value: '<100ms',
    label: 'Latence API',
    colorClass: 'text-purple-400'
  },
  {
    value: 'ISO',
    label: '18004 certified',
    colorClass: 'text-orange-400'
  }
]
</script>
