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
          <!-- Barre de recherche -->
          <div class="relative p-4 border-b border-ash/50">
            <IconSearch class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <input ref="inputRef" v-model="searchQuery" type="text"
              placeholder="Rechercher (ex: documents, settings, prof...)"
              class="w-full pl-12 pr-12 py-3 bg-transparent text-BtW text-lg placeholder-slate-500 outline-none"
              @input="handleInput" @keydown="handleKeydown" />
            <div class="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd class="kbd-hint">Esc</kbd>
            </div>
          </div>

          <!-- Zone des résultats -->
          <div class="max-h-[60vh] overflow-y-auto p-2">
            <!-- État vide / Pas de recherche en cours -->
            <div v-if="!searchQuery" class="p-4 sm:p-8">
              <!-- Si pas de recherches récentes -->
              <div v-if="searchStore.recentSearches.length === 0" class="text-center mt-4">
                <div class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconSearch class="w-8 h-8 text-hsa" />
                </div>
                <p class="text-BtW font-medium">Recherche globale</p>
                <p class="text-hsa text-sm">Trouvez instantanément vos documents, alertes et paramètres.</p>
              </div>

              <!-- Recherches récentes -->
              <div v-else class="animate-fade-in space-y-3">
                <div class="flex items-center justify-between px-2">
                  <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Recherches récentes</h3>
                  <button @click.stop="searchStore.clearRecentSearches()"
                    class="text-xs font-medium text-hsa hover:text-red-400 transition-colors">
                    Tout effacer
                  </button>
                </div>

                <div class="space-y-1">
                  <div v-for="recent in searchStore.recentSearches" :key="recent.id"
                    class="group flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-ash/50 transition-all duration-200">
                    <button @click="selectResult(recent)" class="flex items-center gap-3 flex-1 text-left">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ash text-hsa">
                        <IconClock class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-BtW truncate">{{ recent.title }}</div>
                        <div class="text-xs text-hsa truncate">{{ recent.description }}</div>
                      </div>
                    </button>
                    <!-- Bouton de suppression individuelle -->
                    <button @click.stop="searchStore.removeRecentSearch(recent.id)"
                      class="opacity-0 group-hover:opacity-100 p-1.5 text-hsa hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Retirer des recherches récentes">
                      <IconX class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
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
                        ? (result.isShortcut ? 'bg-ash/50 ring-1 ring-ashAct' : 'bg-primary/10 ring-1 ring-primary/20')
                        : 'hover:bg-ash',
                      result.isShortcut ? 'cursor-help' : 'cursor-pointer'
                    ]" @mouseenter="selectedIndex = getAbsoluteIndex(gIndex, rIndex)">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      :class="getSearchIconStyle(result.type)">
                      <component :is="getSearchIcon(result.type)" class="w-4.5 h-4.5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-bold text-BtW truncate">{{ result.title }}</div>
                      <div class="text-xs text-hsa truncate">{{ result.description }}</div>
                    </div>
                    <div v-if="selectedIndex === getAbsoluteIndex(gIndex, rIndex) && !result.isShortcut"
                      class="text-primary">
                      <IconCornerDownLeft class="w-4 h-4" />
                    </div>
                    <div v-else-if="result.isShortcut" class="text-hsa/40">
                      <IconSquareF1 class="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>

              <!-- Lien pour voir tous les résultats -->
              <div class="p-2">
                <button @click="viewAllResults"
                  class="w-full py-3 rounded-xl border-2 border-dashed border-ash hover:border-primary/30 hover:bg-primary/5 text-sm font-bold text-hsa hover:text-primary transition-all flex items-center justify-center gap-2">
                  <IconExternalLink class="w-4 h-4" />
                  Voir tous les résultats pour "{{ searchQuery }}"
                </button>
              </div>
            </div>
          </div>

          <!-- Pied de page / Informations sur les raccourcis -->
          <div
            class="p-3 bg-ash/30 border-t border-ash/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-medium text-hsa">
            <div class="flex items-center gap-4 flex-wrap justify-center">
              <span class="flex items-center gap-1.5 shrink-0">
                <kbd class="kbd-hint">↑</kbd>
                ou
                <kbd class="kbd-hint">↓</kbd>
                Naviguer
              </span>
              <span class="flex items-center gap-1.5 shrink-0">
                <kbd class="kbd-hint">↵</kbd> Sélectionner
              </span>
            </div>
            <div class="opacity-60">Moteur de recherche CYPASS</div>
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
import { getSearchIcon, getSearchIconStyle } from '~/utils/search'
import { IconSearch, IconCornerDownLeft, IconExternalLink, IconKeyboard, IconSquareF1, IconClock, IconX } from '@tabler/icons-vue'

const searchStore = useSearchStore()
const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

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

const getAbsoluteIndex = (gIndex: number, rIndex: number) => {
  let count = 0
  for (let i = 0; i < gIndex; i++) {
    count += groupedResults.value[i].items.length
  }
  return count + rIndex
}

// Nombre total de résultats
const totalResults = computed(() => searchStore.results.length)

// Gestionnaire de saisie de recherche
const handleInput = () => {
  searchStore.performSearch(searchQuery.value)
  selectedIndex.value = 0
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
  router.push({ path: '/system/search', query: { q: searchQuery.value } })
  searchStore.closeSearch()
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
      inputRef.value?.focus()
    })
  }
})
</script>
