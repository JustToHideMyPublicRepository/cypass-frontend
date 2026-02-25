<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/vigitech" class="p-2.5 rounded-xl hover:bg-ash/20 transition-colors text-hsa">
        <IconArrowLeft class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-BtW tracking-tight">Mes commentaires</h1>
        <p class="text-hsa font-bold text-sm mt-0.5">Historique de vos interventions sur VigiTech</p>
      </div>
    </div>

    <div v-if="userCommentsTotal"
      class="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
      {{ userCommentsTotal }} commentaire{{ userCommentsTotal > 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

defineProps<{
  userCommentsTotal: number
}>()
</script>
