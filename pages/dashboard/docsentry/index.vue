<template>
  <div class="space-y-6">
    <DocsentryHeader @upload="modals.upload = true" @verify="modals.verify = true" />

    <DocsentryTrustCard />

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

    <DocsentryList :documents="filteredDocuments" :loading="store.loading" />

    <!-- Modals -->
    <DocsentryModalAuth :show="modals.upload" :loading="store.loading" :error="store.error"
      :upload-result="store.uploadResult" @upload="handleUpload" @close="closeModals" />

    <DocsentryModalVerify :show="modals.verify" :loading="store.loading" :error="store.error"
      :result="store.verificationResult" @verify="handleVerify" @reset="store.verificationResult = null"
      @close="closeModals" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { IconSearch, IconFilter } from '@tabler/icons-vue'
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
  verify: false
})

const filteredDocuments = computed(() => {
  let docs = store.documents

  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'Verified') {
      docs = docs.filter(d => d.has_certificate)
    } else {
      docs = docs.filter(d => !d.has_certificate)
    }
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    docs = docs.filter(d =>
      d.filename.toLowerCase().includes(q) ||
      d.hash.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    )
  }

  return docs
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
  store.error = null
  store.uploadResult = null
  store.verificationResult = null
}

onMounted(() => {
  store.fetchDocuments()
  store.fetchPublicKey()
})

useHead({
  title: 'Gestion de documents'
})
</script>
