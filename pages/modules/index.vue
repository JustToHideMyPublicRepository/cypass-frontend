<template>
  <div class="relative overflow-hidden">
    <div class="max-w-7xl mx-auto space-y-24 relative z-10">
      <SvcIndexHeader />
      <SvcIndexGrid :services="modules" />
      <SvcIndexFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { modules } from '@/data/modules'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Services'
})
</script>

<style scoped>
.mask-gradient {
  mask-image: radial-gradient(circle at center, black, transparent 80%);
}
</style>
