<template>
  <div class="space-y-6">
    <UiBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'DocSentry', path: '/dashboard/docsentry' },
      { label: doc?.filename || 'Détails' }
    ]" />

    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/docsentry" class="p-2 hover:bg-ash/50 rounded-lg transition-colors text-hsa">
        <IconArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-BtW">Détails du document</h1>
    </div>

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
        <UiBaseCard>
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-xl bg-primary/10 text-primary">
                <IconFileText class="w-8 h-8" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-BtW">{{ doc.filename }}</h2>
                <p class="text-sm text-hsa">ID: {{ doc.id }}</p>
              </div>
            </div>
            <UiStatusBadge
              :status="(doc.availability?.certificate || doc.signature_info?.present) ? 'Verified' : 'Pending'" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-lg bg-ash/30 border border-ash/50">
              <div class="text-[10px] uppercase text-hsa font-semibold mb-1">Date d'émission</div>
              <div class="text-BtW font-medium">{{ formatDate(doc.created_at) }}</div>
            </div>
            <div class="p-4 rounded-lg bg-ash/30 border border-ash/50">
              <div class="text-[10px] uppercase text-hsa font-semibold mb-1">Type de fichier</div>
              <div class="text-BtW font-medium">{{ doc.file_type.toUpperCase() }}</div>
            </div>
            <div class="p-4 rounded-lg bg-ash/30 border border-ash/50 sm:col-span-2">
              <div class="flex justify-between items-center mb-1">
                <div class="text-[10px] uppercase text-hsa font-semibold">Hash SHA-256</div>
                <button @click="copyField(doc.hash, 'hash')"
                  class="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
                  <IconCopy v-if="!copiedFields.hash" class="w-3 h-3" />
                  <IconCheck v-else class="w-3 h-3 text-success" />
                  {{ copiedFields.hash ? 'Copié' : 'Copier' }}
                </button>
              </div>
              <div class="text-BtW font-mono text-sm break-all">{{ doc.hash }}</div>
            </div>
          </div>
        </UiBaseCard>

        <!-- Cryptographic Proof -->
        <UiBaseCard v-if="doc.signature_info">
          <div class="flex items-center gap-2 mb-6 text-BtW">
            <IconShieldCheck class="w-5 h-5 text-primary" />
            <h3 class="font-bold">Preuve Cryptographique</h3>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-ash/50">
              <span class="text-hsa text-sm">Algorithme de signature</span>
              <span class="text-BtW font-medium">{{ doc.signature_info.algorithm }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-ash/50">
              <span class="text-hsa text-sm">Empreinte de la clé publique</span>
              <div class="flex items-center gap-2">
                <span class="text-BtW font-mono text-xs">{{ doc.signature_info.fingerprint }}</span>
                <button @click="copyField(doc.signature_info.fingerprint, 'fingerprint')"
                  class="p-1 hover:text-primary transition-colors">
                  <IconCopy v-if="!copiedFields.fingerprint" class="w-3 h-3" />
                  <IconCheck v-else class="w-3 h-3 text-success" />
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-ash/50">
              <span class="text-hsa text-sm">Date de signature</span>
              <span class="text-BtW font-medium">{{ formatDate(doc.signed_at) }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-hsa text-sm">Statut de la signature</span>
              <span v-if="doc.signature_info.present" class="text-success flex items-center gap-1 font-medium">
                <IconCheck class="w-4 h-4" /> Valide
              </span>
              <span v-else class="text-danger flex items-center gap-1 font-medium">
                <IconX class="w-4 h-4" /> Invalide
              </span>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- Actions & Sidebar -->
      <div class="space-y-6">
        <UiBaseCard>
          <h3 class="font-bold text-BtW mb-4">Actions</h3>
          <div class="space-y-3">
            <UiBaseButton @click="redirectToVerify" class="w-full justify-start" variant="primary">
              <IconShieldCheck class="w-4 h-4 mr-2" /> Vérifier l'authenticité
            </UiBaseButton>
            <UiBaseButton v-if="doc.availability?.certificate" @click="downloadCertificate" class="w-full justify-start"
              variant="secondary">
              <IconCertificate class="w-4 h-4 mr-2" /> Télécharger le certificat
            </UiBaseButton>
            <UiBaseButton @click="shareDocument" class="w-full justify-start" variant="ghost">
              <IconShare class="w-4 h-4 mr-2" /> Partager le document
            </UiBaseButton>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-primary/5 border-primary/20">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded bg-primary text-WtB">
              <IconFingerprint class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-BtW">Souveraineté</h3>
          </div>
          <p class="text-sm text-hsa leading-relaxed">
            Ce document est certifié par l'infrastructure de confiance CYPASS, garantissant son origine et son intégrité
            immuable sur le territoire national.
          </p>
        </UiBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconArrowLeft, IconFileText, IconShieldCheck, IconCertificate, IconShare, IconFingerprint, IconCheck, IconX, IconAlertCircle, IconCopy } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const store = useDocumentsStore()
const docId = route.params.id as string

const doc = computed(() => store.currentDocument)

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}

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

const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.showToast('info', 'Copié', 'Texte copié dans le presse-papier.')
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
