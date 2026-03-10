<template>
  <div class="space-y-6">
    <MeDocsentryDetailHeader :filename="doc?.filename" />

    <!-- Skeleton Loading -->
    <MeDocsentryDetailLoading v-if="userStore.loading" />

    <div v-else-if="userStore.error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
      <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-BtW mb-2">Erreur</h3>
      <p class="text-hsa">{{ userStore.error }}</p>
      <UiBaseButton class="mt-4" @click="fetchDoc">Réessayer</UiBaseButton>
    </div>

    <div v-else-if="doc" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <MeDocsentryDetailInfo :doc="doc" :is-verified="isVerified" :copied-fields="copiedFields" @copy="copyField" />

        <!-- Cryptographic Proof -->
        <MeDocsentryDetailProof :doc="doc" :copied-fields="copiedFields" @copy="copyField" />
      </div>

      <!-- Actions & Sidebar -->
      <MeDocsentryDetailSidebar :has-certificate="!!doc.availability?.certificate" @verify="redirectToVerify"
        @download="downloadCertificate" @share="shareDocument" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconAlertCircle } from '@tabler/icons-vue'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { useToastStore } from '~/stores/front/toast'

const route = useRoute()
const userStore = useUserDocsentryStore()
const publicStore = usePublicDocsentryStore()
const docId = route.params.id as string

const doc = computed(() => userStore.currentDocument)
const isVerified = computed(() => !!(doc.value?.availability?.certificate || doc.value?.signature_info?.present))

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
  await userStore.fetchDocumentById(docId)
}

const redirectToVerify = () => {
  if (!doc.value) return
  navigateTo(`/verify?h=${doc.value.hash}`)
}

const downloadCertificate = async () => {
  if (!doc.value) return
  const success = await publicStore.downloadCertificate(doc.value.id, doc.value.filename)
  if (!success) {
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
  title: doc.value ? `${doc.value.filename} - DocSentry` : 'Détails du document - DocSentry',
  meta: [
    { name: 'description', content: 'Informations détaillées et preuves cryptographiques du document sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
