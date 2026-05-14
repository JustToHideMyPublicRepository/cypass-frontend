<template>
  <div class="text-center space-y-4 animate-fade-down">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ash/50 border border-ashhsa mb-2">
      <IconHome class="w-2.5 h-2.5" />
      <span class="text-[10px] font-bold uppercase tracking-wider text-hsa">Tableau de bord</span>
    </div>

    <h3> Heureux de vous revoir, <span class="text-primary">{{ userName }}</span> </h3>
    <p>
      Veuillez sélectionner l'espace de travail que vous souhaitez utiliser pour cette session.
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconHome } from '@tabler/icons-vue'

defineProps<{
  userName?: string
}>()
</script>
