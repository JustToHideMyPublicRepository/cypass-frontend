<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <RootSystemSearchHeader :query="query" :resultsCount="totalCount" v-model:sortValue="currentSort"
      @modify="searchStore.openSearch()" @reset="performSearch" />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Filters (1/4) -->
      <div class="lg:col-span-1">
        <RootSystemSearchSidebar v-model:activeFilter="activeFilter" :totalCount="totalCount"
          :categoryCounts="categoryCounts" />
      </div>

      <!-- Results Main (2/4) -->
      <div class="lg:col-span-2">
        <RootSystemSearchResult :results="paginatedResults" :loading="loading" :query="query"
          :current-page="currentPage" :total-pages="totalPages" @navigate="navigateToResult"
          @modify="searchStore.openSearch()" @reset="performSearch" @change-page="handlePageChange" />
      </div>

      <!-- Recherches récentes (1/4)-->
      <div class="lg:col-span-1">
        <RootSystemSearchRecents @navigate="navigateToResult" @query-click="handleQueryClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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
const currentSort = ref('default')

const query = computed(() => route.query.q as string || '')

const performSearch = async (q?: string) => {
  const finalQuery = q || query.value
  if (!finalQuery) return
  loading.value = true
  await searchStore.performSearch(finalQuery)
  loading.value = false
}

const handleQueryClick = (q: string) => {
  router.push({ path: '/system/search', query: { q } })
}

const itemsPerPage = 5
const currentPage = ref(1)

const filteredResults = computed(() => {
  let results = [...searchStore.results]

  // Filter by category
  if (activeFilter.value !== 'all') {
    results = results.filter(r => r.category === activeFilter.value)
  }

  // Apply sorting
  switch (currentSort.value) {
    case 'alpha-asc':
      results.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'alpha-desc':
      results.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'count-desc':
      results.sort((a, b) => (categoryCounts.value[b.category || 'Autres'] || 0) - (categoryCounts.value[a.category || 'Autres'] || 0))
      break
    case 'count-asc':
      results.sort((a, b) => (categoryCounts.value[a.category || 'Autres'] || 0) - (categoryCounts.value[b.category || 'Autres'] || 0))
      break
    default:
      // Keep relevance order from store
      break
  }

  return results
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredResults.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredResults.value.length / itemsPerPage))

const handlePageChange = (delta: number) => {
  const next = currentPage.value + delta
  if (next >= 1 && next <= totalPages.value) {
    currentPage.value = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

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
  // Enregistrer comme recherche récente
  searchStore.addRecentSearch(result)
  if (result.path) router.push(result.path)
}

// Charger les recherches récentes
onMounted(() => {
  searchStore.loadRecentSearches()
})

// Watchers
watch([query, activeFilter, currentSort], () => {
  if (query.value) performSearch()
  currentPage.value = 1
}, { immediate: true })

useHead({
  title: computed(() => `Résultats pour "${query.value}"`),
  meta: [
    { name: 'description', content: 'Résultats de votre recherche sur l\'infrastructure CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
