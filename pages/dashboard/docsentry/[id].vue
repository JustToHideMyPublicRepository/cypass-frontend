<template>
  <div class="space-y-6">
    <MeDocsentryDetailsHeader :filename="doc?.filename" />

    <!-- Skeleton Loading -->
    <div v-if="store.loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UiBaseCard>
          <div class="flex items-center gap-4 mb-6">
            <UiAppSkeleton type="avatar" width="60px" height="60px" />
            <div class="space-y-2 flex-1">
              <UiAppSkeleton width="40%" height="24px" />
              <UiAppSkeleton width="20%" height="12px" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UiAppSkeleton v-for="i in 3" :key="i" height="80px" />
          </div>
        </UiBaseCard>
        <UiBaseCard>
          <UiAppSkeleton width="30%" height="20px" class="mb-6" />
          <div class="space-y-4">
            <UiAppSkeleton v-for="i in 4" :key="i" height="40px" />
          </div>
        </UiBaseCard>
      </div>
      <div class="space-y-6">
        <UiBaseCard>
          <UiAppSkeleton width="40%" height="20px" class="mb-4" />
          <div class="space-y-3">
            <UiAppSkeleton v-for="i in 3" :key="i" height="45px" />
          </div>
        </UiBaseCard>
        <UiAppSkeleton height="150px" />
      </div>
    </div>

    <div v-else-if="store.error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
      <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-BtW mb-2">Erreur</h3>
      <p class="text-hsa">{{ store.error }}</p>
      <UiBaseButton class="mt-4" @click="fetchDoc">Réessayer</UiBaseButton>
    </div>

    <div v-else-if="doc" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <MeDocsentryDetailsInfo :doc="doc" :is-verified="isVerified" :copied-fields="copiedFields" @copy="copyField" />

        <!-- Cryptographic Proof -->
        <MeDocsentryDetailsProof :doc="doc" :copied-fields="copiedFields" @copy="copyField" />
      </div>

      <!-- Actions & Sidebar -->
      <MeDocsentryDetailsSidebar :has-certificate="!!doc.availability?.certificate" @verify="redirectToVerify"
        @download="downloadCertificate" @share="shareDocument" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconAlertCircle } from '@tabler/icons-vue'
import { useDocumentsStore } from '~/stores/documents'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const store = useDocumentsStore()
const docId = route.params.id as string

const doc = computed(() => store.currentDocument)
const isVerified = computed(() => (doc.value?.availability?.certificate || doc.value?.signature_info?.present))

const toast = useToastStore()
const copiedFields = reactive<Record<string, boolean>>({
  hash: false,
  fingerprint: false
})

const copyField = (text: string, field: string) => {
  navigator.clipboard.writeText(text)
  copiedFields[field] = true
  toast.showToast('info', 'Copié', 'Texte copié dans le presse-papier.')
  setTimeout(() => copiedFields[field] = false, 2000)
}

const fetchDoc = async () => {
  await store.fetchDocumentById(docId)
}

const redirectToVerify = () => {
  if (!doc.value) return
  navigateTo(`/verify?h=${doc.value.hash}`)
}

const downloadCertificate = async () => {
  if (!doc.value) return
  try {
    const response = await $fetch('/api/documents/download', {
      query: { id: doc.value.id, type: 'certificate' },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(response as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Certificat_${doc.value.filename}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    toast.showToast('error', 'Erreur', 'Impossible de télécharger le certificat.')
  }
}

const shareDocument = async () => {
  if (!doc.value) return

  const publicUrl = `${window.location.origin}/verify?h=${doc.value.hash}`
  const shareData = {
    title: `Document CYPASS: ${doc.value.filename}`,
    text: `Vérifiez l'authenticité de ce document certifié par CYPASS.`,
    url: publicUrl
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(publicUrl)
      toast.showToast('success', 'Lien public copié', 'Le lien de vérification a été copié dans le presse-papier.')
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.warn('Share failed', err)
    }
  }
}

onMounted(() => {
  fetchDoc()
})

useHead({
  title: doc.value ? `${doc.value.filename} - DocSentry` : 'Détails du document - DocSentry'
})
</script>
