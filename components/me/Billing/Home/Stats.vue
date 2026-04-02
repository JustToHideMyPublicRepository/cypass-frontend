<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
    <UiBaseCard class="p-6 bg-primary/5 border-primary/20">
      <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
        Plan actuel</p>
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-BtW uppercase leading-none">{{ planName }}</h3>
        <span class="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase">Actif</span>
      </div>
    </UiBaseCard>

    <UiBaseCard class="p-6">
      <p class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1">
        Crédits restants</p>
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-BtW leading-none">{{ credits }}</h3>
        <span class="text-[10px] font-bold text-hsa truncate max-w-[100px] mt-1">Sur {{ totalCredits }}</span>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  planName: string
  credits: number | string
  totalCredits: number | string
}>()
</script>
