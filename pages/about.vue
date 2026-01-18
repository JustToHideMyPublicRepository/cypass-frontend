<template>
  <div class="relative overflow-x-hidden">
    <AboutHero />
    <AboutMission />
    <AboutValues />
    <AboutStory />
    <AboutTeam />
    <AboutCta />
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
