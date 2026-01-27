<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <DocsentryHeader @upload="modals.upload = true" @verify="modals.verify = true" />
      <button @click="modals.trust = true"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-xs uppercase tracking-widest border border-primary/20">
        <IconInfoCircle class="w-4 h-4" />
        Pourquoi DocSentry ?
      </button>
    </div>

    <!-- Filters and Search -->
    <UiBaseCard>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa">
            <IconSearch class="w-5 h-5" />
          </span>
          <input v-model="searchQuery" type="text" placeholder="Rechercher par nom ou hash..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-ash bg-ash focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-hsa" />
        </div>
        <div class="flex gap-2">
          <select v-model="statusFilter"
            class="px-4 py-2 rounded-lg border border-ash bg-ash text-sm focus:ring-2 focus:ring-primary">
            <option value="all">Tous les statuts</option>
            <option value="Verified">Vérifié</option>
            <option value="Pending">En attente</option>
            <option value="Rejected">Rejeté</option>
          </select>
          <UiBaseButton variant="secondary">
            <IconFilter class="w-4 h-4 mr-2" /> Filtres
          </UiBaseButton>
        </div>
      </div>
    </UiBaseCard>

    <DocsentryList :documents="filteredDocuments" :loading="store.loading" :current-page="currentPage"
      :total-pages="totalPages" @next-page="handleNextPage" @prev-page="handlePrevPage" />

    <!-- Modals -->
    <DocsentryModalAuth :show="modals.upload" :loading="store.loading" :error="store.error"
      :upload-result="store.uploadResult" @upload="handleUpload" @close="closeModals" />

    <DocsentryModalVerify :show="modals.verify" :loading="store.loading" :error="store.error"
      :result="store.verificationResult" @verify="handleVerify" @reset="store.verificationResult = null"
      @close="closeModals" />

    <!-- Trust Card Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modals.trust" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-ashAct/60 backdrop-blur-sm" @click="closeModals"></div>
          <div class="relative w-full max-w-2xl bg-ash border border-ashAct rounded-2xl overflow-hidden shadow-2xl">
            <button @click="closeModals"
              class="absolute top-4 right-4 p-2 hover:bg-ashAct rounded-lg transition-colors z-10">
              <IconX class="w-5 h-5 text-hsa" />
            </button>
            <DocsentryTrustCard class="border-0 shadow-none" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { IconSearch, IconFilter, IconInfoCircle, IconX } from '@tabler/icons-vue'
import { useDocumentsStore } from '~/stores/documents'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'default'
})

const store = useDocumentsStore()
const toast = useToastStore()

const searchQuery = ref('')
const statusFilter = ref('all')
const modals = reactive({
  upload: false,
  verify: false,
  trust: false
})

const currentPage = ref(1)
const limit = 20
const totalPages = computed(() => Math.ceil(store.pagination.total / limit) || 1)

const filteredDocuments = computed(() => {
  return store.documents
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

watch([currentPage, statusFilter, searchQuery], () => {
  const offset = (currentPage.value - 1) * limit
  // Here we should ideally pass filters to the backend, 
  // but if get_all.php doesn't support them, we might need a different approach.
  // For now, let's stick to pagination as requested.
  store.fetchDocuments(limit, offset)
})

onMounted(() => {
  store.fetchDocuments(limit, 0)
  store.fetchPublicKey()
})

useHead({
  title: 'Gestion de documents'
})
</script>
