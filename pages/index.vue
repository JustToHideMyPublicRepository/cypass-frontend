<template>
  <div class="relative overflow-x-hidden">
    <RootHomeBackground />
    <RootHomeHeroBlock />
    <RootHomePartners />
    <RootHomeHowBlock />
    <RootHomeFeaturesBlock />
    <RootHomeDesignPrinciples />
    <RootHomeStats />
    <RootHomePricingsPreview />
    <!-- <RootHomeTestimonials /> -->
    <RootHomeFaq />
    <RootHomeCta />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Votre bouclier numérique pour sécuriser vos actifs numériques',
  meta: [
    { name: 'description', content: 'CYPASS : La plateforme nationale souveraine pour la certification, la signature électronique et la confiance numérique au Bénin.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
