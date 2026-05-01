<template>
  <div class="space-y-6">
    <MeDocsentryDetailHeader :filename="doc?.filename" />

    <!-- Skeleton Loading -->
    <MeDocsentryDetailLoading v-if="userStore.loading && !doc" />

    <div v-else-if="userStore.error && !doc" class="bg-danger/10 border border-danger/20 p-6 rounded-xl text-center">
      <IconAlertCircle class="w-12 h-12 text-danger mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-BtW mb-2">Erreur</h3>
      <p class="text-hsa">{{ userStore.error }}</p>
      <UiBaseButton class="mt-4" @click="fetchDoc">Réessayer</UiBaseButton>
    </div>

    <div v-else-if="doc" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <MeDocsentryDetailInfo :doc="doc" :is-verified="isVerified" :copied-fields="copiedFields" @copy="copyField" />

        <!-- Child Versions -->
        <MeDocsentryDetailVersions v-if="doc.certification_mode === 'simple' && doc.has_versions"
          :versions="doc.versions || []" :loading="isFiltering" @copy="copyField" @update-filters="handleFilters" />

        <!-- Enriched Metadata -->
        <MeDocsentryDetailEnriched v-if="doc.certification_mode === 'enrichie'" :metadata="doc.enriched_metadata"
          :category="doc.document_category" />

        <!-- Cryptographic Proof -->
        <MeDocsentryDetailProof :doc="doc" :copied-fields="copiedFields" @copy="copyField" />
      </div>

      <!-- Actions & Sidebar -->
      <div class="space-y-6">
        <MeDocsentryDetailSidebar :document-id="doc.id" :has-certificate="!!doc.availability?.certificate"
          :has-versions="doc.certification_mode === 'simple' && doc.has_versions" :created-at="doc.created_at"
          :is-zip-downloaded="doc.certification_mode === 'simple' && doc.is_zip_downloaded"
          :certificate-download-count="doc.certificate_download_count" :certification-mode="doc.certification_mode"
          :multi-version-generations="doc.certification_mode === 'simple' ? doc.multi_version_generations : []"
          :multi-version-generation-count="doc.certification_mode === 'simple' ? doc.multi_version_generation_count : 0"
          @verify="redirectToVerify" @download="downloadCertificate" @download-zip="downloadZip" @share="shareDocument"
          @refresh-doc="startPollingForVersions" />
      </div>
    </div>

    <!-- Modals -->
    <ModalGlobalShare :show="showShareModal" :title="shareTitle" :text="shareText" :url="shareUrl"
      @close="showShareModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconAlertCircle } from '@tabler/icons-vue'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { useToastStore } from '~/stores/front/toast'

const route = useRoute()
const userStore = useUserDocsentryStore()
const docId = route.params.id as string

const doc = computed(() => userStore.currentDocument)
const isVerified = computed(() => !!(doc.value?.availability?.certificate || doc.value?.signature_info?.present))

const toast = useToastStore()
const copiedFields = reactive<Record<string, boolean>>({
  hash: false,
  fingerprint: false
})

const sort = ref('recent')
const search = ref('')
const isFiltering = ref(false)

const showShareModal = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareText = ref('')

const copyField = (text: string, field: string) => {
  navigator.clipboard.writeText(text)
  copiedFields[field] = true
  toast.showToast('info', 'Copié', 'Texte copié dans le presse-papier.')
  setTimeout(() => copiedFields[field] = false, 2000)
}

const fetchDoc = async (background: boolean = false) => {
  await userStore.fetchDocumentById(docId, sort.value, search.value, background)
}

let pollingInterval: any = null
const startPollingForVersions = () => {
  let attempts = 0
  const initialCount = doc.value?.versions?.length || 0

  if (pollingInterval) clearInterval(pollingInterval)

  // Faire une première tentative immédiate au bout d'1 seconde
  setTimeout(() => fetchDoc(true), 1000)

  pollingInterval = setInterval(async () => {
    attempts++
    await fetchDoc(true)
    const newCount = doc.value?.versions?.length || 0
    if (newCount > initialCount || attempts >= 15) {
      clearInterval(pollingInterval)
    }
  }, 3000)
}

const handleFilters = async (filters: { sort: string; search: string }) => {
  sort.value = filters.sort
  search.value = filters.search
  isFiltering.value = true
  await userStore.fetchDocumentById(docId, sort.value, search.value, true)
  isFiltering.value = false
}

const redirectToVerify = () => {
  if (!doc.value) return
  navigateTo(`/verify?h=${doc.value.hash}`)
}

const downloadCertificate = async () => {
  if (!doc.value) return
  const success = await userStore.downloadCertificate(doc.value.id, doc.value.filename)
  if (!success) {
    toast.showToast('error', 'Erreur', userStore.error || 'Impossible de télécharger le certificat.')
  } else if (userStore.currentDocument) {
    userStore.currentDocument.certificate_download_count = (userStore.currentDocument.certificate_download_count || 0) + 1
  }
}

const downloadZip = async () => {
  if (!doc.value) return
  const success = await userStore.downloadZip(doc.value.id, doc.value.filename)
  if (!success) {
    toast.showToast('error', 'Erreur', userStore.error || 'Impossible de télécharger l’archive ZIP.')
  } else {
    toast.showToast('success', 'Téléchargement', 'L’archive ZIP est prête.')
    if (userStore.currentDocument) {
      userStore.currentDocument.is_zip_downloaded = true
    }
  }
}

const shareDocument = () => {
  if (!doc.value) return

  shareUrl.value = `${window.location.origin}/verify?h=${doc.value.hash}`
  shareTitle.value = `Document CYPASS: ${doc.value.filename}`
  shareText.value = `Vérifiez l'authenticité de ce document certifié par CYPASS.`
  showShareModal.value = true
}

onMounted(() => {
  fetchDoc()
})

useHead({
  title: doc.value ? `${doc.value.filename} - DocSentry` : 'Détails du document - DocSentry',
  meta: [
    { name: 'description', content: 'Informations détaillées et preuves cryptographiques du document sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
