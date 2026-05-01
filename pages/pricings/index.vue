<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <!-- Decorative Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

    <RootPricingsHeader />

    <RootPricingsTabs v-model="activeTab" :tabs="tabs" />

    <!-- CONTENT -->
    <div class="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
      style="animation-duration: 400ms;" :key="activeTab">
      <RootPricingsGridMain v-if="activeTab === 'basic'" :tiers="individualTiers" />
      <RootPricingsGridMain v-else-if="activeTab === 'extension'" :tiers="addonTiers" />
      <RootPricingsGridApi v-else-if="activeTab === 'api'" :tiers="apiTiers" />
    </div>

    <RootPricingsComparisonBasic v-if="activeTab === 'basic'" />
    <RootPricingsComparisonAddons v-else-if="activeTab === 'extension'" />
    <RootPricingsComparisonApi v-else-if="activeTab === 'api'" />
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { individualTiers, addonTiers, apiTiers } from '~/utils/pricing'
import { IconUser, IconPuzzle, IconCode } from '@tabler/icons-vue'

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

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'basic', label: 'Basique', icon: markRaw(IconUser) },
  { id: 'extension', label: 'Extensions', icon: markRaw(IconPuzzle) },
  { id: 'api', label: 'API', icon: markRaw(IconCode) }
]

const validTabs = tabs.map(t => t.id)
const defaultTab = 'basic'

const activeTab = ref(
  validTabs.includes(route.query.tab as string)
    ? (route.query.tab as string)
    : defaultTab
)

watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})
</script>
