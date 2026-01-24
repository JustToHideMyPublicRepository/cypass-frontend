<template>
  <div class="relative overflow-x-hidden">
    <IndHomeBackground />
    <IndHomeHero />
    <IndHomePartners />
    <IndHomeHowItWorks />
    <IndHomeFeatures />
    <IndHomeStats />
    <IndHomeTestimonials />
    <IndHomeFaq />
    <IndHomeCta />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Souveraineté numérique & sécurité'
})
</script>
