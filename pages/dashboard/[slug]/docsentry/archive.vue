<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Archives DocSentry</h1>
        <p class="text-hsa text-sm">Gérez vos documents archivés et restaurez-les si nécessaire.</p>
      </div>
      <NuxtLink to="/dashboard/docsentry"
        class="inline-flex items-center gap-2 text-primary hover:underline font-medium">
        <IconArrowLeft class="w-4 h-4" />
        Retour à la liste
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <!-- Main Content: Document List -->
      <div class="space-y-6">
        <MeDocsentryHomeList :documents="store.archivedDocuments" :loading="store.loading" :current-page="currentPage"
          :totalPages="totalPages" :is-archive="true" @next-page="handleNextPage" @prev-page="handlePrevPage"
          @refresh="fetchArchives" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'

const store = useUserDocsentryStore()

const currentPage = ref(1)
const limit = 10
const totalPages = computed(() => Math.ceil(store.archivedPagination.total / limit) || 1)

const fetchArchives = () => {
  const offset = (currentPage.value - 1) * limit
  store.fetchArchivedDocuments(limit, offset)
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchArchives()
  }
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchArchives()
  }
}

onMounted(() => {
  fetchArchives()
})

useHead({
  title: 'Archives DocSentry',
  meta: [
    { name: 'description', content: 'Gérez vos documents archivés sur DocSentry.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
