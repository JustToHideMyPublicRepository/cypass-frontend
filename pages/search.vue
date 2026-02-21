<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-BtW tracking-tight mb-2">Résultats de recherche</h1>
      <p class="text-hsa font-medium">Affichage des résultats pour "<span class="text-primary">{{ query }}</span>"</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Filters -->
      <aside class="space-y-6">
        <UiBaseCard title="Filtrer par catégorie">
          <div class="space-y-2">
            <button @click="activeFilter = 'all'"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm font-medium"
              :class="activeFilter === 'all' ? 'bg-primary text-WtB' : 'text-BtW hover:bg-ash'">
              <span>Tous</span>
              <span class="text-[10px] opacity-70">{{ totalCount }}</span>
            </button>
            <button v-for="(count, cat) in categoryCounts" :key="cat" @click="activeFilter = cat"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm font-medium"
              :class="activeFilter === cat ? 'bg-primary text-WtB' : 'text-BtW hover:bg-ash'">
              <span>{{ cat }}</span>
              <span class="text-[10px] opacity-70">{{ count }}</span>
            </button>
          </div>
        </UiBaseCard>
      </aside>

      <!-- Results Main -->
      <main class="lg:col-span-3 space-y-6">
        <div v-if="loading" class="space-y-4">
          <UiAppSkeleton v-for="i in 5" :key="i" height="80px" />
        </div>

        <div v-else-if="filteredResults.length === 0" class="bg-WtB rounded-2xl p-12 text-center border border-ash">
          <div class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconSearch class="w-8 h-8 text-hsa" />
          </div>
          <h3 class="text-lg font-bold text-BtW">Aucun résultat</h3>
          <p class="text-hsa">Essayez avec d'autres mots-clés ou modifiez vos filtres.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="result in filteredResults" :key="result.id"
            class="bg-WtB border border-ash rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer group"
            @click="navigateToResult(result)">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :class="[
                result.type === 'navigation' ? 'bg-blue-500/10 text-blue-500' :
                  result.type === 'document' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-purple-500/10 text-purple-500'
              ]">
                <component :is="getIcon(result.type)" class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs font-black text-primary uppercase tracking-widest">{{ result.category }}</span>
                  <span class="text-hsa text-[10px]">•</span>
                  <span class="text-[10px] text-hsa">{{ result.type.toUpperCase() }}</span>
                </div>
                <h4 class="text-base font-bold text-BtW truncate group-hover:text-primary transition-colors">{{
                  result.title }}</h4>
                <p class="text-sm text-hsa truncate line-clamp-1">{{ result.description }}</p>
              </div>
              <IconChevronRight class="w-5 h-5 text-hsa group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '~/stores/search'
import { IconSearch, IconFileDescription, IconLayoutDashboard, IconSettings, IconChevronRight } from '@tabler/icons-vue'

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

const getIcon = (type: string) => {
  switch (type) {
    case 'navigation': return IconLayoutDashboard
    case 'document': return IconFileDescription
    case 'action': return IconSettings
    default: return IconSearch
  }
}

// Watchers
watch(query, () => {
  performSearch()
}, { immediate: true })

useHead({
  title: computed(() => `Résultats pour "${query.value}"`)
})
</script>
