<template>
  <div class="max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10 px-4 sm:px-6">
    <RootStatusHero />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
      <div class="lg:col-span-2 space-y-8 md:space-y-12">
        <RootStatusMainCard />
        <RootStatusComponents />
      </div>
      <div class="lg:col-span-1 h-full">
        <RootStatusHistory />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSystemStore } from '~/stores/back/public/system'

definePageMeta({
  layout: 'guest'
})

const systemStore = useSystemStore()

onMounted(() => {
  systemStore.fetchSystemStatus()
})

useHead({
  title: 'Statut de services',
  meta: [
    { name: 'description', content: 'Vérifiez en temps réel l\'état de fonctionnement des services CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
