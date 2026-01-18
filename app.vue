<template>
  <div class="min-h-screen bg-gradient-premium text-textClr font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const heroImagePath = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800";
const baseUrl = "https://cypass.bj";

useHead({
  titleTemplate: '%s | CYPASS',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin. Certification, veille & audit en temps réel.'
    },

    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: 'CYPASS - Souveraineté Numérique & Sécurité' },
    { property: 'og:description', content: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin. Certification, Veille & Audit en temps réel.' },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'CYPASS - Souveraineté Numérique' },
    { name: 'twitter:description', content: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin.' },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>