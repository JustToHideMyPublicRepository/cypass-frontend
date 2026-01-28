<template>
  <div class="space-y-6 md:space-y-8 px-4 sm:px-0">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <DocsentryHeader @upload="modals.upload = true" @verify="modals.verify = true" />

      <button @click="modals.trust = true"
        class="flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-[10px] md:text-xs uppercase tracking-widest border border-primary/20 shrink-0">
        <IconInfoCircle class="w-4 h-4" />
        Pourquoi DocSentry ?
      </button>
    </div>

    <!-- Filters and Search -->
    <DocsentryFilters v-model="filters" :available-types="availableTypes" @reset="resetFilters" />

    <DocsentryList :documents="filteredDocuments" :loading="store.loading" :current-page="currentPage"
      :total-pages="totalPages" @next-page="handleNextPage" @prev-page="handlePrevPage" />

    <!-- Modals -->
    <DocsentryModalAuth :show="modals.upload" :loading="store.loading" :error="store.error"
      :upload-result="store.uploadResult" @upload="handleUpload" @update:error="(val) => store.error = val"
      @error-clear="store.error = null" @close="closeModals" />

    <DocsentryModalVerify :show="modals.verify" :loading="store.loading" :error="store.error"
      :result="store.verificationResult" @verify="handleVerify" @reset="store.verificationResult = null"
      @close="closeModals" />

    <!-- Trust Card Modal -->
    <DocsentryTrustCard :show="modals.trust" @close="modals.trust = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { IconInfoCircle } from '@tabler/icons-vue'
import { useDocumentsStore } from '~/stores/documents'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'default'
})

const store = useDocumentsStore()
const toast = useToastStore()

const filters = reactive({
  filename: '',
  file_type: 'all',
  date_start: '',
  date_end: ''
})

const modals = reactive({
  upload: false,
  verify: false,
  trust: false
})

const resetFilters = () => {
  filters.filename = ''
  filters.file_type = 'all'
  filters.date_start = ''
  filters.date_end = ''
  currentPage.value = 1
}

const currentPage = ref(1)
const limit = 20
const totalPages = computed(() => Math.ceil(store.pagination.total / limit) || 1)

const filteredDocuments = computed(() => {
  return store.documents
})

const availableTypes = computed(() => {
  const types = new Set(store.documents.map(d => d.file_type.toUpperCase()))
  // Ensure the currently selected type is also in the list even if no results are found
  if (filters.file_type !== 'all') {
    types.add(filters.file_type.toUpperCase())
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
  const success = await store.verifyDocument(file)
  if (success) {
    if (store.verificationResult?.verified) {
      toast.showToast('success', 'Authentique', 'Le document est certifié valide par CYPASS.')
    } else {
      toast.showToast('warning', 'Attention', 'La signature de ce document est invalide ou corrompue.')
    }
  } else {
    toast.showToast('error', 'Erreur', store.error || 'Erreur lors de la vérification.')
  }
}

const closeModals = () => {
  modals.upload = false
  modals.verify = false
  modals.trust = false
  store.error = null
  store.uploadResult = null
  store.verificationResult = null
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
    const apiFilters = {
      ...filters,
      date_start: filters.date_start ? filters.date_start.replace('T', ' ') + ':00' : '',
      date_end: filters.date_end ? filters.date_end.replace('T', ' ') + ':00' : ''
    }
    store.fetchDocuments(limit, offset, apiFilters)
  }, 300)
}, { deep: true })

onMounted(() => {
  store.fetchDocuments(limit, 0)
  store.fetchPublicKey()
})

useHead({
  title: 'Gestion de documents'
})
</script>
