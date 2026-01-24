<template>
  <div class="relative overflow-x-hidden">
    <IndAboutHero />
    <IndAboutMission />
    <IndAboutValues />
    <IndAboutStory />
    <IndAboutTeam />
    <IndAboutCta />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'À Propos'
})
</script>
