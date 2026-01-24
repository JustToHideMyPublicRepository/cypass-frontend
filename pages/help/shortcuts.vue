<template>
  <div class="max-w-4xl mx-auto px-4 py-8 relative">
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
  const global = Object.values(shortcutsData).filter(s => s.isGlobal)
  const contextual = Object.values(shortcutsData).filter(s => !s.isGlobal)

  return [
    { title: 'Navigation Globale', items: global },
    { title: 'Raccourcis Contextuels', items: contextual }
  ]
})

const filteredShortcuts = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return structuredShortcuts.value.map(cat => {
    let items = [...cat.items]

    // Search filter
    if (query) {
      items = items.filter(s =>
        s.label.toLowerCase().includes(query) ||
        s.key.toLowerCase().includes(query)
      )
    }

    // Sorting
    items.sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.label.localeCompare(b.label)
      } else {
        return a.key.localeCompare(b.key)
      }
    })

    return { ...cat, items }
  }).filter(cat => cat.items.length > 0)
})
</script>
