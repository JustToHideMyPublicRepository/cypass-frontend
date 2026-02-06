<template>
  <span :class="[
    'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all duration-300 hover:scale-105',
    statusClass
  ]">
    <span class="w-1.5 h-1.5 rounded-full mr-2 animate-pulse" :class="dotClass"></span>
    <slot>{{ status }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Propriétés du composant StatusBadge
const props = defineProps<{
  status: string
}>()

// Calcul des classes de conteneur selon le statut
const statusClass = computed(() => {
  const s = props.status.toLowerCase()
  if (['active', 'verified'].includes(s)) return 'bg-success/10 text-success border-success/20 shadow-success/5'
  if (['pending', 'medium'].includes(s)) return 'bg-warning/10 text-warning border-warning/20 shadow-warning/5'
  if (['rejected', 'high'].includes(s)) return 'bg-danger/10 text-danger border-danger/20 shadow-danger/5'
  if (['low'].includes(s)) return 'bg-primary/10 text-primary border-primary/20 shadow-primary/5'
  return 'bg-ash/50 text-hsa border-ashAct/50'
})

// Calcul de la couleur du point indicateur
const dotClass = computed(() => {
  const s = props.status.toLowerCase()
  if (['active', 'verified'].includes(s)) return 'bg-success'
  if (['pending', 'medium'].includes(s)) return 'bg-warning'
  if (['rejected', 'high'].includes(s)) return 'bg-danger'
  if (['low'].includes(s)) return 'bg-primary'
  return 'bg-hsa'
})
</script>
