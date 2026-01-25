<template>
  <div class="max-w-5xl mx-auto px-4 relative">
    <HelpShortcutsHeader @open-settings="showSettings = true" />
    <HelpShortcutsExpertMode />

    <HelpShortcutsSearch ref="searchComp" v-model:searchQuery="searchQuery" v-model:sortBy="sortBy" />

    <HelpShortcutsGrid :categories="filteredShortcuts" />
    <HelpShortcutsFooter />

    <!-- Settings Modal -->
    <ModalShortcuts :show="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { shortcutsData } from '@/data/shortcuts'
import { useShortcutsStore } from '~/stores/shortcuts'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Raccourcis Clavier'
})

const store = useShortcutsStore()
const searchComp = ref<any>(null)
const searchQuery = ref('')
const sortBy = ref<'name' | 'key'>(store.sortBy)
const showSettings = ref(false)

// Persist sort preference to store
watch(sortBy, (newVal) => {
  store.sortBy = newVal
  store.save()
})

useShortcuts({
  searchCallback: () => searchComp.value?.focus()
})

// Process shortcuts data
const structuredShortcuts = computed(() => {
  const groups: Record<string, any[]> = {}

  Object.values(shortcutsData).forEach(s => {
    const groupName = s.group || (s.isGlobal ? 'Autres' : 'Actions Contextuelles')
    if (!groups[groupName]) groups[groupName] = []
    groups[groupName].push(s)
  })

  // Order groups
  const order = [
    'Navigation',
    'Authentification',
    'Dashboard',
    'Modules',
    'Légal',
    'Actions Contextuelles'
  ]

  return Object.keys(groups)
    .sort((a, b) => {
      const idxA = order.indexOf(a)
      const idxB = order.indexOf(b)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return a.localeCompare(b)
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

    // Search filter
    if (query) {
      items = items.filter(s =>
        s.label.toLowerCase().includes(query) ||
        s.keys.some((k: string) => k.toLowerCase().includes(query))
      )
    }

    // Sorting
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
