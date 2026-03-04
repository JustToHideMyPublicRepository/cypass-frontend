<template>
  <div class="relative overflow-x-hidden">
    <RootAboutHero />
    <RootAboutMission />
    <RootAboutValues />
    <RootAboutStory />
    <RootAboutTeam />
    <RootAboutCta />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'À Propos',
  meta: [
    { name: 'description', content: 'En savoir plus sur la mission et les valeurs de CYPASS pour la confiance numérique.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
