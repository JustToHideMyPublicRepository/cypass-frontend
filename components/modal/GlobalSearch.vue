<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="searchStore.isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-32">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" @click="searchStore.closeSearch()"></div>

        <!-- Modal Content -->
        <div
          class="relative w-full max-w-2xl bg-WtB border border-ash/50 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
          <!-- Search Input -->
          <div class="relative p-4 border-b border-ash/50">
            <IconSearch class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <input ref="inputRef" v-model="searchQuery" type="text"
              placeholder="Rechercher (ex: documents, settings, prof...)"
              class="w-full pl-12 pr-12 py-3 bg-transparent text-BtW text-lg placeholder-slate-500 outline-none"
              @input="handleInput" @keydown="handleKeydown" />
            <div class="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd
                class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">Esc</kbd>
            </div>
          </div>

          <!-- Results Area -->
          <div class="max-h-[60vh] overflow-y-auto p-2">
            <!-- Empty State / No Query -->
            <div v-if="!searchQuery" class="p-8 text-center">
              <div class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconSearch class="w-8 h-8 text-hsa" />
              </div>
              <p class="text-BtW font-medium">Recherche globale</p>
              <p class="text-hsa text-sm">Trouvez instantanément vos documents, alertes et paramètres.</p>
            </div>

            <!-- No Results -->
            <div v-else-if="searchStore.results.length === 0 && !searchStore.isLoading" class="p-8 text-center">
              <p class="text-hsa">Aucun résultat trouvé pour "<span class="text-BtW font-medium">{{ searchQuery
                  }}</span>"
              </p>
            </div>

            <!-- Loading State -->
            <div v-else-if="searchStore.isLoading" class="p-8">
              <UiLogoLoader size="lg" />
            </div>

            <!-- Results List -->
            <div v-else class="space-y-4">
              <div v-for="(group, gIndex) in groupedResults" :key="group.name">
                <div class="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ group.name }}
                </div>
                <div class="space-y-1">
                  <button v-for="(result, rIndex) in group.items.slice(0, 3)" :key="result.id"
                    @click="selectResult(result)"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                    :class="[
                      selectedIndex === getAbsoluteIndex(gIndex, rIndex)
                        ? 'bg-primary/10 ring-1 ring-primary/20'
                        : 'hover:bg-ash'
                    ]" @mouseenter="selectedIndex = getAbsoluteIndex(gIndex, rIndex)">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="[
                      result.type === 'navigation' ? 'bg-blue-500/10 text-blue-500' :
                        result.type === 'document' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-purple-500/10 text-purple-500'
                    ]">
                      <component :is="getIcon(result.type)" class="w-4.5 h-4.5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-bold text-BtW truncate">{{ result.title }}</div>
                      <div class="text-xs text-hsa truncate">{{ result.description }}</div>
                    </div>
                    <div v-if="selectedIndex === getAbsoluteIndex(gIndex, rIndex)" class="text-primary">
                      <IconCornerDownLeft class="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>

              <!-- View All Link -->
              <div class="p-2">
                <button @click="viewAllResults"
                  class="w-full py-3 rounded-xl border-2 border-dashed border-ash hover:border-primary/30 hover:bg-primary/5 text-sm font-bold text-hsa hover:text-primary transition-all flex items-center justify-center gap-2">
                  <IconExternalLink class="w-4 h-4" />
                  Voir tous les résultats pour "{{ searchQuery }}"
                </button>
              </div>
            </div>
          </div>

          <!-- Footer / Shortcuts Info -->
          <div
            class="p-3 bg-ash/30 border-t border-ash/50 flex items-center justify-between text-[10px] font-medium text-hsa">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5">
                <kbd class="px-1 py-0.5 rounded bg-WtB border border-ash text-[10px] font-bold">↑</kbd>
                ou
                <kbd class="px-1 py-0.5 rounded bg-WtB border border-ash text-[10px] font-bold">↓</kbd>
                Naviguer
              </span>
              <span class="flex items-center gap-1.5">
                <kbd class="px-1 py-0.5 rounded bg-WtB border border-ash text-[10px] font-bold">↵</kbd> Sélectionner
              </span>
            </div>
            <div>Moteur de recherche CYPASS</div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '~/stores/search'
import { IconSearch, IconFileDescription, IconLayoutDashboard, IconSettings, IconCornerDownLeft, IconExternalLink } from '@tabler/icons-vue'

const searchStore = useSearchStore()
const router = useRouter()
const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const groupedResults = computed(() => {
  const groups: Record<string, any[]> = {}
  searchStore.results.forEach(res => {
    const cat = res.category || 'Autres'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(res)
  })

  return Object.entries(groups).map(([name, items]) => ({ name, items }))
})

const getAbsoluteIndex = (gIndex: number, rIndex: number) => {
  let count = 0
  for (let i = 0; i < gIndex; i++) {
    count += groupedResults.value[i].items.length
  }
  return count + rIndex
}

const totalResults = computed(() => searchStore.results.length)

const handleInput = () => {
  searchStore.performSearch(searchQuery.value)
  selectedIndex.value = 0
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % totalResults.value
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + totalResults.value) % totalResults.value
  } else if (e.key === 'Enter') {
    const result = searchStore.results[selectedIndex.value]
    if (result) selectResult(result)
  } else if (e.key === 'Escape') {
    searchStore.closeSearch()
  }
}

const selectResult = (result: any) => {
  if (result.path) {
    router.push(result.path)
    searchStore.closeSearch()
  }
}

const viewAllResults = () => {
  router.push({ path: '/system/search', query: { q: searchQuery.value } })
  searchStore.closeSearch()
}

const getIcon = (type: string) => {
  switch (type) {
    case 'navigation': return IconLayoutDashboard
    case 'document': return IconFileDescription
    case 'action': return IconSettings
    default: return IconSearch
  }
}

watch(() => searchStore.isOpen, (val) => {
  if (val) {
    searchQuery.value = ''
    selectedIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.kbd-hint {
  @apply bg-ash px-1.5 py-0.5 rounded text-[10px] font-bold;
}
</style>
