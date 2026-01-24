<template>
  <div class="relative">
    <div class="max-w-5xl mx-auto space-y-16">
      <IndPartnersHeader @open-modal="isModalOpen = true" />
      <IndPartnersGrid :partners="partners" />
    </div>

    <!-- Partner Modal -->
    <ModalPartnerRequest :show="isModalOpen" @close="isModalOpen = false" @submit="handlePartnerRequest" />
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

const handlePartnerRequest = () => {
  // Simulate API call log
  console.log('Partner request submitted')
  // Modal handles its own feedback/close logic via the component internal state if needed, 
  // but here we just show how the page handles the event.
  setTimeout(() => {
    isModalOpen.value = false
  }, 1000)
}
</script>
