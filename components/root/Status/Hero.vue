<template>
  <div class="text-center space-y-3 md:space-y-4 animate-fade-up">
    <h1 class="text-3xl md:text-5xl font-black tracking-tight">
      État du <span :class="status.colorClass">{{ status.label }}</span>
    </h1>
    <p class="text-base md:text-lg text-hsa max-w-2xl mx-auto">
      Statut en temps réel de nos services et infrastructures.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  status: {
    label: string
    colorClass: string
  }
}>()
</script>
