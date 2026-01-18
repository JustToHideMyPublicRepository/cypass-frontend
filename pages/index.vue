<template>
  <div class="relative overflow-x-hidden">
    <HomeBackground />
    <HomeHero />
    <HomePartners />
    <HomeHowItWorks />
    <HomeFeatures />
    <HomeStats />
    <HomeTestimonials />
    <HomeFaq />
    <HomeCta />
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
