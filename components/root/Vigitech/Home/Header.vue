<template>
  <div class="max-w-3xl mb-12 md:mb-20">
    <h3 class="mb-4"> {{ greeting }} </h3>
    <p>
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
