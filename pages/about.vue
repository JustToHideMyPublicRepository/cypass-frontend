<template>
  <div class="relative bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
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
  title: 'À Propos',
  meta: [
    {
      name: 'description',
      content: 'Découvrez l\'équipe et la mission de Bourse de Fret Bénin, la plateforme n°1 du transport de marchandises au Bénin.'
    }
  ]
});
</script>
