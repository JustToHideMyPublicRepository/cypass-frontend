<template>
  <div class="w-full max-w-md">
    <AuthRegisterHeader />
    <AuthRegisterForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

// Métadonnées SEO
useHead({
  title: 'Inscription',
  meta: [
    { name: 'description', content: 'Inscrivez-vous sur CYPASS, la plateforme de souveraineté numérique.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
