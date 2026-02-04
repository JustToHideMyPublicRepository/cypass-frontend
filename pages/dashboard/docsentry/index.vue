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
        <!-- Stats Gadget -->
        <MeDocsentryHomeSidebarStats :total="store.pagination.total"
          :verified="store.documents.filter(d => d.has_certificate).length"
          :usage="Math.min(Math.round((store.pagination.total / 50) * 100), 100)" />

        <!-- Filters -->
        <MeDocsentryHomeFilters v-model="filters" :available-types="availableTypes" @reset="resetFilters" />

        <!-- Info/Trust Section -->
        <UiBaseCard class="bg-gradient-to-br from-BtW to-hsa border-none relative overflow-hidden group">
          <div class="relative z-10 space-y-3">
            <h3 class="font-bold flex items-center gap-2 text-WtB">
              <IconInfoCircle class="w-5 h-5 text-primary" />
              DocSentry Trust
            </h3>
            <p class="text-[11px] leading-relaxed text-WtB">
              Vos documents sont protégés par une signature cryptographique immuable sur la blockchain CYPASS.
            </p>
            <button @click="modals.trust = true"
              class="w-full py-2 px-3 rounded-lg bg-WtB/5 border border-WtB/10 text-[10px] font-bold uppercase tracking-wider hover:bg-WtB/10 transition-colors text-WtB">
              En savoir plus
            </button>
          </div>
          <!-- Decorative element -->
          <div
            class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors">
          </div>
        </UiBaseCard>
      </div>
    </div>

    <!-- Modals -->
    <ModalDocSentryAuth :show="modals.upload" :loading="store.loading" :error="store.error"
      :upload-result="store.uploadResult" @upload="handleUpload" @update:error="(val) => store.error = val"
      @error-clear="store.error = null" @close="closeModals" />

    <<ModalDocSentryVerify :show="modals.verify" :loading="store.loading" :error="store.error"
      :result="store.verificationResult" @verify="handleVerify" @reset="store.verificationResult = null"
      @close="closeModals" />

    <!-- Trust Card Modal -->
    <MeDocsentryHomeTrustCard :show="modals.trust" @close="modals.trust = false" />
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

const filters = ref({
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
  filters.value.filename = ''
  filters.value.file_type = 'all'
  filters.value.date_start = ''
  filters.value.date_end = ''
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
      ...filters.value,
      date_start: filters.value.date_start ? filters.value.date_start.replace('T', ' ') + ':00' : '',
      date_end: filters.value.date_end ? filters.value.date_end.replace('T', ' ') + ':00' : ''
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
