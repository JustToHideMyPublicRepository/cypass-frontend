<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <RootFaqHeader />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
        <!-- Sidebar: Filtres -->
        <div class="lg:col-span-1">
          <RootFaqFilters ref="categoriesComp" :categories="faqCategories"
            v-model:selectedCategory="selectedCategoryText" v-model:searchQuery="searchQuery" class="sticky top-24" />
        </div>

        <!-- Main: FAQ List -->
        <div class="lg:col-span-3">
          <RootFaqList :categories="filteredCategories" />
        </div>
      </div>

      <RootFaqCta />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { faqCategories } from '@/data/faq'
import { useShortcuts } from '~/composables/useShortcuts'

const categoriesComp = ref<any>(null)
const searchQuery = ref('')
const selectedCategoryText = ref<string | null>(null)

// Focus keyboard shortcut (Ctrl+K)
useShortcuts({
  localSearchCallback: () => categoriesComp.value?.focus()
})

definePageMeta({
  layout: 'guest'
})

const route = useRoute()

onMounted(() => {
  const cat = route.query.cat as string
  const q = route.query.q as string
  if (cat) selectedCategoryText.value = cat
  if (q) searchQuery.value = q
})

// Filter FAQ based on search and selection
const filteredCategories = computed(() => {
  let categories = faqCategories

  // Filter by Category Selection
  if (selectedCategoryText.value) {
    categories = categories.filter(cat => cat.title === selectedCategoryText.value)
  }

  // Filter by Search
  if (searchQuery.value) {
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0)
  }

  return categories
})

useHead({
  title: 'Questions fréquentes'
})
</script>
