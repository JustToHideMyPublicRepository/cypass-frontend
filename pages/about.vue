<template>
  <div class="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-x-hidden">
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
</script>
