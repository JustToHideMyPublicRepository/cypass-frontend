<template>
  <div class="space-y-3 md:space-y-4 animate-fade-up" style="animation-delay: 200ms">
    <h3 class="text-base md:text-lg font-bold pl-2">Historique des incidents</h3>

    <div v-if="incidents.length > 0" class="space-y-4">
      <div v-for="incident in incidents" :key="incident.id"
        class="glass-panel p-6 rounded-xl md:rounded-2xl border border-ash/50 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black uppercase tracking-widest opacity-60">{{ incident.date }}</span>
          <span class="badge badge-primary text-[10px]">{{ incident.type }}</span>
        </div>
        <h4 class="font-bold text-base">{{ incident.title }}</h4>
        <p class="text-sm text-hsa leading-relaxed">{{ incident.description }}</p>
        <div class="flex items-center gap-2 text-xs font-bold text-success">
          <IconCheck class="w-3.5 h-3.5" /> Résolu
        </div>
      </div>
    </div>

    <div v-else class="glass-panel p-6 md:p-8 rounded-xl md:rounded-2xl text-center py-8 md:py-12 border border-ash/50">
      <p class="text-sm md:text-base text-hsa">Aucun incident signalé au cours des 30 derniers jours.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

defineProps<{
  incidents: Array<{
    id: number
    date: string
    type: string
    title: string
    description: string
  }>
}>()
</script>
