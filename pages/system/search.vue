<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <RootSystemSearchHeader :query="query" />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Filters -->
      <RootSystemSearchSidebar v-model:activeFilter="activeFilter" :totalCount="totalCount"
        :categoryCounts="categoryCounts" />

      <!-- Results Main -->
      <RootSystemSearchResult :results="filteredResults" :loading="loading" @navigate="navigateToResult" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '~/stores/search'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const loading = ref(true)
const activeFilter = ref('all')

const query = computed(() => route.query.q as string || '')

const performSearch = async () => {
  if (!query.value) return
  loading.value = true
  await searchStore.performSearch(query.value)
  loading.value = false
}

const filteredResults = computed(() => {
  if (activeFilter.value === 'all') return searchStore.results
  return searchStore.results.filter(r => r.category === activeFilter.value)
})

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  searchStore.results.forEach(r => {
    const cat = r.category || 'Autres'
    counts[cat] = (counts[cat] || 0) + 1
  })
  return counts
})

const totalCount = computed(() => searchStore.results.length)

const navigateToResult = (result: any) => {
  if (result.path) router.push(result.path)
}

// Watchers
watch(query, () => {
  performSearch()
}, { immediate: true })

useHead({
  title: computed(() => `Résultats pour "${query.value}"`)
})
</script>
