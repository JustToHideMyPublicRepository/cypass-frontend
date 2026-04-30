<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <!-- Decorative Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

    <RootPricingsHeader />

    <!-- TABS -->
    <div class="flex justify-center mb-16 relative z-10 scale-90 sm:scale-100 origin-center transition-transform">
      <div
        class="bg-ash/50 backdrop-blur-xl p-1.5 rounded-[2.5rem] border border-ash/60 inline-flex items-center shadow-lg">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="relative px-6 sm:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 outline-none"
          :class="activeTab === tab.id ? 'text-BtW' : 'text-hsa hover:text-BtW'">
          <!-- Background Indicator -->
          <span v-if="activeTab === tab.id"
            class="absolute inset-0 bg-WtB shadow mt-0.5 rounded-full -z-10 ring-1 ring-ash/20 transition-all"></span>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
      style="animation-duration: 400ms;" :key="activeTab">
      <RootPricingsGrid v-if="activeTab === 'individual'" :tiers="individualTiers" />
      <RootPricingsGrid v-else-if="activeTab === 'enterprise'" :tiers="addonTiers" />
      <RootPricingsGrid v-else-if="activeTab === 'api'" :tiers="apiTiers" />
    </div>

    <RootPricingsComparison v-if="activeTab !== 'api' && activeTab !== 'enterprise'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { individualTiers, addonTiers, apiTiers } from '~/utils/pricing'

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

const tabs = [
  { id: 'basic', label: 'Basique' },
  { id: 'extension', label: 'Extensions' },
  { id: 'api', label: 'API' }
]

const activeTab = ref('basic')
</script>
