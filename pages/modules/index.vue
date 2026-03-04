<template>
  <div class="relative overflow-hidden">
    <div class="max-w-7xl mx-auto space-y-16 md:space-y-24 relative z-10 px-4 sm:px-6 lg:px-8">
      <RootModuleHomeHeader />
      <RootModuleHomeGrid :services="modules" />
      <RootModuleHomeFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { modules } from '@/data/modules'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Modules',
  meta: [
    { name: 'description', content: 'Découvrez les différents services et modules de sécurité proposés par CYPASS.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<style scoped>
.mask-gradient {
  mask-image: radial-gradient(circle at center, black, transparent 80%);
}
</style>
