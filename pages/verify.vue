<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
    <!-- Background Decor -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]">
      </div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-3xl w-full space-y-12 text-center animate-fade-up">
      <div class="space-y-4">
        <span class="badge badge-primary">DocSentry Public</span>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-BtW">
          Vérifier l'authenticité <br />
          <span class="text-primary text-3xl md:text-5xl font-bold">d'un document CYPASS</span>
        </h1>
        <p class="text-lg text-hsa max-w-xl mx-auto">
          Déposez un document certifié par notre plateforme pour confirmer son intégrité et l'identité de son émetteur.
        </p>
      </div>

      <!-- Verification Zone (Standalone version of ModalVerify) -->
      <div class="glass-panel p-8 md:p-12 rounded-[40px] border border-ashAct shadow-2xl relative group">
        <!-- Interactive Dropzone -->
        <div v-if="!file"
          class="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer bg-WtB/50 hover:bg-primary/5 group"
          @click="triggerFileSelect" @dragover.prevent @drop.prevent="handleDrop">
          <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
          <div
            class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 transition-transform duration-500">
            <IconShieldCheck class="w-10 h-10" />
          </div>
          <h3 class="text-xl font-bold text-BtW mb-2">Sélectionnez le document PDF</h3>
          <p class="text-sm text-hsa">Glissez-déposez le fichier ici ou cliquez pour parcourir</p>
        </div>

        <div v-else class="space-y-8">
          <!-- Selected File Header -->
          <div class="flex items-center gap-4 p-4 bg-ash/20 rounded-2xl border border-ash animate-fade-in">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <IconFileText class="w-6 h-6" />
            </div>
            <div class="flex-1 text-left min-w-0">
              <p class="font-bold text-BtW truncate">{{ file.name }}</p>
              <p class="text-xs text-hsa">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
            <button @click="reset" class="text-hsa hover:text-danger p-2 transition-colors">
              <IconX class="w-5 h-5" />
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="py-12 flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm font-bold text-hsa animate-pulse">Analyse cryptographique en cours...</p>
          </div>

          <!-- Result View -->
          <div v-if="result" class="animate-fade-up text-left">
            <div v-if="result.verified"
              class="p-6 md:p-8 rounded-3xl bg-success/5 border border-success/20 overflow-hidden relative">
              <div class="absolute top-0 right-0 p-8 opacity-10">
                <IconRosetteDiscountCheck class="w-32 h-32 text-success" />
              </div>

              <div class="flex items-center gap-3 text-success mb-6 relative z-10">
                <IconShieldCheck class="w-8 h-8" />
                <span class="text-2xl font-black italic">DOCUMENT AUTHENTIQUE</span>
              </div>

              <div class="space-y-6 relative z-10">
                <p class="text-BtW text-lg leading-relaxed">
                  Ce document est certifié conforme. Il a été signé numériquement par
                  <strong class="text-primary">{{ result.document.signer }}</strong>
                  et n'a subi aucune modification depuis son émission.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-success/10">
                  <div class="space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black tracking-widest">Identifiant Unique</p>
                    <p class="font-mono text-sm text-BtW bg-WtB/50 p-2 rounded">{{ result.document.id }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black tracking-widest">Horodatage</p>
                    <p class="text-sm font-bold text-BtW">{{ formatDate(result.document.created_at) }}</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <p class="text-[10px] text-hsa uppercase font-black tracking-widest">Empreinte Numérique (SHA-256)</p>
                  <div class="flex items-center gap-2 bg-WtB/50 p-3 rounded-xl border border-ash/50">
                    <span class="font-mono text-[10px] text-hsa break-all flex-1">{{ result.document.hash }}</span>
                    <button @click="copy(result.document.hash)"
                      class="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                      <IconCopy v-if="!copied" class="w-4 h-4 text-hsa" />
                      <IconCheck v-else class="w-4 h-4 text-success" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-8 rounded-3xl bg-danger/5 border border-danger/20">
              <div class="flex items-center gap-3 text-danger mb-4">
                <IconShieldOff class="w-8 h-8" />
                <span class="text-xl font-black">ÉCHEC DE LA VÉRIFICATION</span>
              </div>
              <p class="text-hsa leading-relaxed">
                Attention, ce document ne peut pas être authentifié. <br>
                Causes possibles : modification du contenu, altération des métadonnées ou document non émis par CYPASS.
              </p>
              <UiBaseButton variant="danger" class="mt-8" outlined @click="reset">Réessayer</UiBaseButton>
            </div>
          </div>

          <div v-if="!loading && !result" class="flex justify-center pt-4">
            <UiBaseButton size="lg" class="px-12" @click="handleVerify">Vérifier le document</UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Public Info -->
      <div class="grid md:grid-cols-3 gap-8 py-8">
        <div v-for="info in publicBenefits" :key="info.title" class="space-y-2 text-center">
          <div class="w-12 h-12 bg-ash rounded-2xl flex items-center justify-center mx-auto text-primary mb-4">
            <component :is="info.icon" class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-BtW">{{ info.title }}</h4>
          <p class="text-xs text-hsa leading-relaxed px-4">{{ info.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IconShieldCheck, IconFileText, IconShieldOff, IconX,
  IconCopy, IconCheck, IconServer, IconLock, IconCertificate, IconRosetteDiscountCheck
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Vérifier un document | CYPASS'
})

const store = useDocumentsStore()
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const result = ref<any>(null)
const copied = ref(false)

const triggerFileSelect = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    file.value = target.files[0]
    result.value = null
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files.length) {
    file.value = e.dataTransfer.files[0]
    result.value = null
  }
}

const handleVerify = async () => {
  if (!file.value) return
  loading.value = true

  // We use the same backend service. Even for public, it acts on the document content.
  // In a real scenario, public verify might not require login token but here we proxy via Nitro.
  // Note: For TRUE public verify, the Nitro route server/api/documents/upload.post.ts 
  // might need to bypass getCookie check if the backend allows it.

  try {
    const success = await store.verifyDocument(file.value)
    if (success) {
      result.value = store.verificationResult
    }
  } finally {
    loading.value = false
  }
}

const reset = () => {
  file.value = null
  result.value = null
}

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P p', { locale: fr })
  } catch (e) {
    return dateStr
  }
}

const publicBenefits = [
  { icon: IconLock, title: 'Confidentialité', desc: 'Le document est analysé puis immédiatement supprimé de nos serveurs.' },
  { icon: IconServer, title: 'Infrastructures d\'État', desc: 'Vérification effectuée sur les serveurs souverains du Bénin.' },
  { icon: IconCertificate, title: 'Preuve Légale', desc: 'Validité juridique conforme aux normes de signature électronique.' }
]
</script>
