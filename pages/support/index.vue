<template>
  <div class="relative pb-12 md:pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-12 md:space-y-16">
      <!-- Header avec barre de recherche -->
      <RootSupportHeader ref="headerComp" v-model:searchQuery="searchQuery" />

      <!-- Grille de catégories -->
      <RootSupportCategories :categories="categories" @select="onSelectCategory" />

      <!-- Sections transverses -->
      <RootSupportFaqTeaser />

      <RootSupportFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supportData } from '~/data/support'
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()
const router = useRouter()
const headerComp = ref<any>(null)
const searchQuery = ref('')

useShortcuts({
  searchCallback: () => searchStore.openSearch(),
  localSearchCallback: () => headerComp.value?.focus()
})

definePageMeta({
  layout: 'guest'
})

const categories = supportData

const onSelectCategory = (category: any) => {
  router.push(`/support/${category.id}`)
}

useHead({
  title: 'Centre d\'aide'
})
</script>
