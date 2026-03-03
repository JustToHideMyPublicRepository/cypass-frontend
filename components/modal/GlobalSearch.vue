<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="searchStore.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Arrière-plan sombre -->
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" @click="searchStore.closeSearch()"></div>

        <!-- Contenu de la modale -->
        <div
          class="relative w-full max-w-2xl bg-WtB border border-ash/50 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">

          <ModalGlobalSearchHeader ref="headerRef" v-model="searchQuery" @input="handleInput" @keydown="handleKeydown"
            @clear="handleClear" />

          <!-- Zone des résultats -->
          <div class="max-h-[60vh] overflow-y-auto p-2">
            <!-- État vide / Pas de recherche en cours -->
            <div v-if="!searchQuery" class="p-4 sm:p-8">
              <!-- Si pas d'historique du tout -->
              <div v-if="searchStore.recentSearches.length === 0 && searchStore.recentQueries.length === 0"
                class="text-center mt-4">
                <div class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconSearch class="w-8 h-8 text-hsa" />
                </div>
                <p class="text-BtW font-medium">Recherche globale</p>
                <p class="text-hsa text-sm">Trouvez instantanément vos documents, alertes et paramètres.</p>
              </div>

              <ModalGlobalSearchHistory v-else @select-query="handleSelectQuery" @select-result="selectResult" />
            </div>

            <!-- Saisie trop courte -->
            <div v-else-if="searchQuery.length === 1" class="p-8 text-center animate-fade-in">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconKeyboard class="w-6 h-6 text-primary" />
              </div>
              <p class="text-BtW font-medium">Continuez à saisir...</p>
              <p class="text-hsa text-sm">Veuillez saisir au moins 2 caractères pour lancer la recherche.</p>
            </div>

            <!-- Aucun résultat trouvé -->
            <div v-else-if="searchStore.results.length === 0 && !searchStore.isLoading" class="p-8 text-center">
              <p class="text-hsa">Aucun résultat trouvé pour "<span class="text-BtW font-medium">{{ searchQuery
                  }}</span>"
              </p>
            </div>

            <!-- État de chargement -->
            <div v-else-if="searchStore.isLoading" class="p-8">
              <UiLogoLoader size="lg" />
            </div>

            <!-- Liste des résultats -->
            <ModalGlobalSearchResults v-else v-model:selectedIndex="selectedIndex" :grouped-results="groupedResults"
              :search-query="searchQuery" @select-result="selectResult" @view-all="viewAllResults" />
          </div>

          <ModalGlobalSearchFooter />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconSearch, IconKeyboard } from '@tabler/icons-vue'
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()
const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const selectedIndex = ref(0)
const headerRef = ref<any>(null)

// Charger les recherches récentes au montage
onMounted(() => {
  searchStore.loadRecentSearches()
})

const groupedResults = computed(() => {
  const groups: Record<string, any[]> = {}
  searchStore.results.forEach(res => {
    const cat = res.category || 'Autres'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(res)
  })

  return Object.entries(groups).map(([name, items]) => ({ name, items }))
})

// Nombre total de résultats
const totalResults = computed(() => searchStore.results.length)

// Gestionnaire de saisie de recherche
const handleInput = () => {
  searchStore.performSearch(searchQuery.value)
  selectedIndex.value = 0
}

const handleClear = () => {
  searchStore.results = []
  selectedIndex.value = 0
}

const handleSelectQuery = (query: string) => {
  searchQuery.value = query
  handleInput()
}

// Gestionnaire des touches clavier pour la navigation
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

// Sélection d'un résultat et redirection
const selectResult = (result: any) => {
  if (result.isShortcut) return

  // Enregistrer comme recherche récente
  searchStore.addRecentSearch(result)

  if (result.path) {
    router.push(result.path)
    searchStore.closeSearch()
  }
}

// Redirection vers la page de recherche complète
const viewAllResults = () => {
  if (searchQuery.value) {
    searchStore.addRecentQuery(searchQuery.value)
    router.push({ path: '/system/search', query: { q: searchQuery.value } })
    searchStore.closeSearch()
  }
}

// Réinitialisation lors de l'ouverture
watch(() => searchStore.isOpen, (val) => {
  if (val) {
    // Pré-remplir avec le paramètre de recherche de l'URL si présent
    const urlQuery = route.query.q as string
    searchQuery.value = urlQuery || ''

    if (searchQuery.value) {
      searchStore.performSearch(searchQuery.value)
    }

    selectedIndex.value = 0
    nextTick(() => {
      headerRef.value?.focus()
    })
  }
})
</script>
