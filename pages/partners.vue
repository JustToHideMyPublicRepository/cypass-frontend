<template>
  <div class="relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
      <RootPartnersHeader @open-modal="isModalOpen = true" />
      <RootPartnersGrid :partners="partners" />
    </div>

    <ModalPartnerRequest :show="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { partners } from '@/data/partners'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Partenaires'
})

const isModalOpen = ref(false)
</script>
