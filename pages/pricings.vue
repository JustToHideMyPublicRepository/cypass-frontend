<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <!-- Decorative Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

    <RootPricingsHeader />
    <RootPricingsGrid />
    <RootPricingsComparison />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Packs et tarifs de certification',
  meta: [
    { name: 'description', content: 'Consultez nos différentes offres et tarifs pour la certification numérique et les services de confiance CYPASS.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
