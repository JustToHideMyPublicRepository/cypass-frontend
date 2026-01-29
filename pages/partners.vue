<template>
  <div class="relative">
    <div class="max-w-5xl mx-auto space-y-16">
      <RootPartnersHeader @open-modal="isModalOpen = true" />
      <RootPartnersGrid :partners="partners" />
    </div>

    <!-- Partner Modal -->
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
