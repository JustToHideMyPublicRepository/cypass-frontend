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
  title: 'Souveraineté numérique & sécurité',
  meta: [
    { name: 'description', content: 'CYPASS : La plateforme nationale souveraine pour la certification, la signature électronique et la confiance numérique au Bénin.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
