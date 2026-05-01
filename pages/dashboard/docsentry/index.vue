<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <MeDocsentryHomeHeader @upload="modals.upload = true" @verify="modals.verify = true" />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content: Document List -->
      <div class="lg:col-span-3 space-y-6">
        <MeDocsentryHomeList :documents="filteredDocuments" :loading="store.loading" :current-page="currentPage"
          :totalPages="totalPages" @next-page="handleNextPage" @prev-page="handlePrevPage" />
      </div>

      <!-- Sidebar: Filters & Info -->
      <div class="space-y-6">
        <!-- Filters -->
        <MeDocsentryHomeFilters v-model="filters" :available-types="availableTypes" @reset="resetFilters" />

        <!-- Stats Gadget -->
        <MeDocsentryHomeSidebarStats :total="store.pagination.total"
          :verified="store.documents.filter(d => d.has_certificate).length"
          :usage="Math.min(Math.round((store.pagination.total / 50) * 100), 100)" />

        <!-- Unified Info Section -->
        <MeDocsentryHomeInfoSide @open-trust="modals.trust = true" @open-categories="modals.enrich = true" />
      </div>
    </div>

    <!-- Modals -->
    <ModalDocsentryAuth :show="modals.upload" :loading="store.loading" :error="store.error"
      :upload-result="store.uploadResult" @upload="handleUpload" @update:error="(val) => store.error = val"
      @error-clear="store.error = null" @close="closeModals" />

    <ModalDocsentryVerify :show="modals.verify" :loading="publicStore.loading" :error="publicStore.error"
      :result="publicStore.verificationResult" @verify="handleVerify" @reset="publicStore.verificationResult = null"
      @close="closeModals" />

    <!-- Trust Card Modal -->
    <ModalDocsentryTrust :show="modals.trust" @close="modals.trust = false" />

    <!-- Enrich Categories Modal -->
    <ModalDocsentryEnrich :show="modals.enrich" @close="modals.enrich = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { useToastStore } from '~/stores/front/toast'

const store = useUserDocsentryStore()
const publicStore = usePublicDocsentryStore()
const toast = useToastStore()

const filters = ref({
  filename: '',
  file_type: 'all',
  date_start: '',
  date_end: '',
  with_versions: 'all',
  certification_mode: 'all'
})

const modals = reactive({
  upload: false,
  verify: false,
  trust: false,
  enrich: false
})

const resetFilters = () => {
  filters.value.filename = ''
  filters.value.file_type = 'all'
  filters.value.date_start = ''
  filters.value.date_end = ''
  filters.value.with_versions = 'all'
  filters.value.certification_mode = 'all'
  currentPage.value = 1
}

const currentPage = ref(1)
const limit = 10
const totalPages = computed(() => Math.ceil(store.pagination.total / limit) || 1)

const filteredDocuments = computed(() => {
  return store.documents
})

const availableTypes = computed(() => {
  const types = new Set(store.documents.map(d => d.file_type.toUpperCase()))
  // Ensure the currently selected type is also in the list even if no results are found
  if (filters.value.file_type !== 'all') {
    types.add(filters.value.file_type.toUpperCase())
  }
  return Array.from(types).sort()
})

const handleUpload = async (file: File) => {
  const success = await store.uploadDocument(file)
  if (success) {
    toast.showToast('success', 'Document certifié', 'Votre document a été signé et enregistré avec succès.')
  } else {
    toast.showToast('error', 'Échec', store.error || 'Une erreur est survenue.')
  }
}

const handleVerify = async (file: File) => {
  const success = await publicStore.verifyDocumentFull(file, null)
  if (success) {
    if (publicStore.verificationResult?.verified) {
      toast.showToast('success', 'Authentique', 'Le document est certifié valide par CYPASS.')
    } else {
      toast.showToast('warning', 'Attention', 'La signature de ce document est invalide ou corrompue.')
    }
  } else {
    toast.showToast('error', 'Erreur', publicStore.error || 'Erreur lors de la vérification.')
  }
}

const closeModals = () => {
  modals.upload = false
  modals.verify = false
  modals.trust = false
  modals.enrich = false
  store.error = null
  store.uploadResult = null
  publicStore.error = null
  publicStore.verificationResult = null
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

let debounceTimeout: NodeJS.Timeout
watch([currentPage, filters], () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    const offset = (currentPage.value - 1) * limit
    const apiFilters: any = {
      ...filters.value,
      date_start: filters.value.date_start ? filters.value.date_start.replace('T', ' ') + ':00' : '',
      date_end: filters.value.date_end ? filters.value.date_end.replace('T', ' ') + ':00' : ''
    }
    if (apiFilters.certification_mode === 'all') {
      delete apiFilters.certification_mode
    }
    store.fetchDocuments(limit, offset, apiFilters)
  }, 300)
}, { deep: true })

onMounted(() => {
  store.fetchDocuments(limit, 0)
  publicStore.fetchPublicKey()
  publicStore.fetchEnrichmentCategories()
})

useHead({
  title: 'Gestion de documents',
  meta: [
    { name: 'description', content: 'Gérez et vérifiez l\'intégrité de vos documents numériques sur DocSentry.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
