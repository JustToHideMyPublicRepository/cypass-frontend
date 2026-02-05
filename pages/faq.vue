<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <RootFaqHeader ref="headerComp" v-model:searchQuery="searchQuery" />
      <RootFaqCategories :categories="faqCategories" v-model:selectedCategory="selectedCategoryText" />

      <RootFaqList :categories="filteredCategories" />
      <RootFaqCta />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { faqCategories } from '@/data/faq'

const headerComp = ref<any>(null)
const searchQuery = ref('')
const selectedCategoryText = ref<string | null>(null)

useShortcuts({
  searchCallback: () => headerComp.value?.focus()
})

definePageMeta({
  layout: 'guest'
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
