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
  title: 'À Propos'
})
</script>
