<template>
  <div class="max-w-3xl mb-12 md:mb-20">
    <h1 class="text-4xl md:text-6xl font-black text-BtW tracking-tighter mb-6">
      {{ greeting }}
    </h1>
    <p class="text-lg md:text-xl text-hsa leading-relaxed">
      Veille communautaire sur la cybersécurité. Consultez les derniers incidents signalés et apprenez à vous
      protéger contre les menaces émergentes au Bénin.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  greeting: string
}>()
</script>
