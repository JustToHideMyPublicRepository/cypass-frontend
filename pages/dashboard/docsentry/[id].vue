<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/docsentry" class="p-2 hover:bg-ash/50 rounded-lg transition-colors text-hsa">
        <IconArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-BtW">Détails du document</h1>
    </div>

    <div v-if="store.loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p class="text-hsa">Chargement des informations du document...</p>
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
            <UiStatusBadge :status="doc.has_certificate ? 'Verified' : 'Pending'" />
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
              <div class="text-[10px] uppercase text-hsa font-semibold mb-1">Hash SHA-256</div>
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
              <span class="text-BtW font-mono text-xs">{{ doc.signature_info.fingerprint }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-ash/50">
              <span class="text-hsa text-sm">Date de signature</span>
              <span class="text-BtW font-medium">{{ formatDate(doc.signed_at) }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-hsa text-sm">Statut de la signature</span>
              <span v-if="doc.signature_info.present" class="text-green-500 flex items-center gap-1 font-medium">
                <IconCheck class="w-4 h-4" /> Valide
              </span>
              <span v-else class="text-red-500 flex items-center gap-1 font-medium">
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
            <UiBaseButton class="w-full justify-start" variant="secondary">
              <IconDownload class="w-4 h-4 mr-2" /> Télécharger l'original
            </UiBaseButton>
            <UiBaseButton v-if="doc.availability.certificate" class="w-full justify-start" variant="secondary">
              <IconCertificate class="w-4 h-4 mr-2" /> Télécharger le certificat
            </UiBaseButton>
            <UiBaseButton class="w-full justify-start" variant="primary">
              <IconShare class="w-4 h-4 mr-2" /> Partager le document
            </UiBaseButton>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-primary/5 border-primary/20">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded bg-primary text-white">
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconArrowLeft, IconFileText, IconShieldCheck, IconDownload, IconCertificate, IconShare, IconFingerprint, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'

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

const fetchDoc = async () => {
  await store.fetchDocumentById(docId)
}

onMounted(() => {
  fetchDoc()
})

useHead({
  title: doc.value ? `${doc.value.filename} - DocSentry` : 'Détails du document - DocSentry'
})
</script>
