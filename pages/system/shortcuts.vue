<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <RootSystemShortcutsHeader @open-settings="showSettings = true" @open-expert="showExpert = true" />

    <RootSystemShortcutsSearch ref="searchComp" v-model:searchQuery="searchQuery" v-model:sortBy="sortBy"
      v-model:groupSort="groupSort" />

    <RootSystemShortcutsGrid :categories="filteredShortcuts" />
    <RootSystemShortcutsFooter />

    <!-- Paramètres Modale -->
    <ModalShortcutsSetting :show="showSettings" @close="showSettings = false" />
    <ModalShortcutsExpertDetails :show="showExpert" @close="showExpert = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useShortcutsStore } from '~/stores/shortcuts'
import { useSearchStore } from '~/stores/search'
import { useShortcuts } from '~/composables/useShortcuts'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Raccourcis Clavier'
})

const store = useShortcutsStore()
const searchStore = useSearchStore()
const searchComp = ref<any>(null)
const searchQuery = ref('')
const sortBy = ref<'name' | 'key'>(store.sortBy)
const groupSort = ref<'az' | 'za' | 'more' | 'less'>(store.groupSort)
const showSettings = ref(false)
const showExpert = ref(false)

// Conserver les préférences de tri dans le stockage
watch(sortBy, (newVal) => {
  store.sortBy = newVal
  store.save()
})

watch(groupSort, (newVal) => {
  store.groupSort = newVal
  store.save()
})

useShortcuts({
  searchCallback: () => searchStore.openSearch(),
  localSearchCallback: () => searchComp.value?.focus()
})

// Données de raccourcis de traitement
const structuredShortcuts = computed(() => {
  const groups: Record<string, any[]> = {}

  Object.entries(store.mergedShortcuts).forEach(([id, s]) => {
    const groupName = s.group || (s.isGlobal ? 'Général' : 'Actions Contextuelles')
    if (!groups[groupName]) groups[groupName] = []
    groups[groupName].push({ ...s, id })
  })

  // Trier les groupes selon la préférence groupSort
  return Object.keys(groups)
    .sort((a, b) => {
      switch (groupSort.value) {
        case 'za':
          return b.localeCompare(a)
        case 'more':
          return groups[b].length - groups[a].length
        case 'less':
          return groups[a].length - groups[b].length
        case 'az':
        default:
          return a.localeCompare(b)
      }
    })
    .map(name => ({
      title: name,
      items: groups[name]
    }))
})

const filteredShortcuts = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return structuredShortcuts.value.map(cat => {
    let items = [...cat.items]

    // Filtre de recherche
    if (query) {
      items = items.filter(s =>
        s.label.toLowerCase().includes(query) ||
        s.keys.some((k: string) => k.toLowerCase().includes(query))
      )
    }

    // Tri
    items.sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.label.localeCompare(b.label)
      } else {
        const keyA = a.keys.join('')
        const keyB = b.keys.join('')
        return keyA.localeCompare(keyB)
      }
    })

    return { ...cat, items }
  }).filter(cat => cat.items.length > 0)
})
</script>
