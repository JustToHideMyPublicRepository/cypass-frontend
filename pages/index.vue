<template>
  <div class="relative overflow-x-hidden">
    <RootHomeBackground />
    <RootHomeHero />
    <RootHomePartners />
    <RootHomeHowItWorks />
    <RootHomeFeatures />
    <RootHomeStats />
    <RootHomeTestimonials />
    <RootHomeFaq />
    <RootHomeCta />
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
