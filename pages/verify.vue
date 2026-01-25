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

      <!-- Verification Zone -->
      <div class="glass-panel p-8 md:p-12 rounded-[40px] border border-ashAct shadow-2xl relative group">
        <!-- Mode Switcher -->
        <div v-if="!result && !loading" class="flex justify-center mb-8">
          <div class="flex p-1 bg-ash/50 rounded-xl border border-ash">
            <button @click="verifyMode = 'file'" class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
              :class="verifyMode === 'file' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
              Fichier PDF
            </button>
            <button @click="verifyMode = 'hash'" class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
              :class="verifyMode === 'hash' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
              Empreinte (Hash)
            </button>
          </div>
        </div>

        <!-- Interactive Dropzone -->
        <div v-if="!file && verifyMode === 'file' && !result"
          class="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer bg-WtB/50 hover:bg-primary/5 group"
          @click="triggerFileSelect" @dragover.prevent @drop.prevent="handleDrop">
          <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
          <div
            class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 transition-transform duration-500">
            <IconRosetteDiscountCheck class="w-10 h-10" />
          </div>
          <h3 class="text-xl font-bold text-BtW mb-2">Sélectionnez le document PDF</h3>
          <p class="text-sm text-hsa">Glissez-déposez le fichier ici ou cliquez pour parcourir</p>
        </div>

        <!-- Hash Input Zone -->
        <div v-else-if="verifyMode === 'hash' && !result" class="max-w-md mx-auto space-y-4 py-8">
          <div class="space-y-2 text-left">
            <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Code SHA-256 du document</label>
            <div class="relative">
              <IconHash class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
              <input v-model="hashInput" type="text"
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
                placeholder="Entrez l'empreinte numérique...">
            </div>
          </div>
          <UiBaseButton block size="lg" :disabled="!hashInput || hashInput.length < 10" @click="handleVerifyHash">
            Vérifier l'empreinte
          </UiBaseButton>
        </div>

        <div v-if="(file || result) && verifyMode === 'file' || result" class="space-y-8">
          <!-- Selected File Header (Only for file mode) -->
          <div v-if="file && !result"
            class="flex items-center gap-4 p-4 bg-ash/20 rounded-2xl border border-ash animate-fade-in">
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
                <IconRosetteDiscountCheck class="w-8 h-8" />
                <span class="text-2xl font-black italic">DOCUMENT AUTHENTIQUE</span>
              </div>

              <div class="space-y-6 relative z-10">
                <p class="text-BtW text-lg leading-relaxed">
                  Confirmation d'authenticité pour le document
                  <strong class="text-primary">{{ result.document?.filename || 'Anonyme' }}</strong>.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black">Émetteur du Document</p>
                    <p class="font-bold text-BtW">{{ result.document?.signer || 'CYPASS Network' }}</p>
                  </div>
                  <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black">Type / Format</p>
                    <p class="font-bold text-BtW uppercase">{{ result.document?.file_type || 'PDF' }} (Certifié)</p>
                  </div>
                  <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black">Date d'Exécution</p>
                    <p class="font-bold text-BtW">{{ formatDate(result.document?.created_at || result.verification_time)
                    }}</p>
                  </div>
                  <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black">Identifiant (ID)</p>
                    <p class="font-mono text-xs text-BtW">{{ result.document?.id || 'N/A' }}</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <p class="text-[10px] text-hsa uppercase font-black tracking-widest px-1">Empreinte Numérique
                    (SHA-256)</p>
                  <div
                    class="p-3 bg-ash/30 rounded-xl border border-ash/50 font-mono text-[10px] text-hsa break-all opacity-80 select-none">
                    {{ truncateHash(result.document?.hash || result.doc_hash || '') }}
                  </div>
                </div>

                <!-- Signature Details -->
                <div v-if="result.signature_info" class="p-5 bg-ash/5 rounded-2xl border border-ash/50 space-y-4">
                  <h4 class="text-xs font-bold text-BtW flex items-center gap-2">
                    <IconLock class="w-4 h-4 text-primary" /> Détails Techniques de la Signature
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-[11px]">
                    <div class="flex justify-between md:block">
                      <span class="text-hsa">Algorithme</span>
                      <p class="font-bold text-BtW">{{ result.signature_info.algorithm || 'Ed25519' }}</p>
                    </div>
                    <div class="flex justify-between md:block">
                      <span class="text-hsa">Statut de la Clé</span>
                      <p class="font-bold" :class="result.signature_info.key_match ? 'text-success' : 'text-danger'">
                        {{ result.signature_info.key_match ? 'Clé Correspondante ✓' : 'Conflit de Clé ✗' }}
                      </p>
                    </div>
                    <div class="md:col-span-2">
                      <span class="text-hsa">Empreinte de la Clé publique</span>
                      <p class="font-mono text-[10px] text-BtW truncate">{{ result.signature_info.key_fingerprint ||
                        'N/A' }}</p>
                    </div>
                    <div class="md:col-span-2">
                      <span class="text-hsa">Date de Signature</span>
                      <p class="font-bold text-BtW">{{ formatDate(result.signature_info.signed_at) }}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2 text-success font-black uppercase">
                    <IconRosetteDiscountCheck class="w-4 h-4" />
                    Vérifié le {{ formatDate(result.verification_time) }}
                  </div>
                  <button @click="reset" class="text-primary font-bold hover:underline">Nouvelle vérification</button>
                </div>
              </div>
            </div>

            <div v-else class="p-8 rounded-3xl bg-danger/5 border border-danger/20">
              <div class="flex items-center gap-3 text-danger mb-4">
                <IconShieldOff class="w-8 h-8" />
                <span class="text-xl font-black">ÉCHEC DE LA VÉRIFICATION</span>
              </div>
              <p class="text-hsa leading-relaxed mb-6">
                Attention, ce document ne peut pas être authentifié. <br>
                Causes possibles : modification du contenu, altération des métadonnées ou document non émis par CYPASS.
              </p>
              <div v-if="error" class="mb-6 p-4 bg-danger/10 rounded-xl text-xs text-danger font-mono">{{ error }}</div>
              <UiBaseButton variant="danger" block @click="reset">Réessayer</UiBaseButton>
            </div>
          </div>

          <div v-if="!loading && !result && file" class="flex justify-center pt-4">
            <UiBaseButton size="lg" class="px-12" @click="handleVerifyFile">Vérifier le document</UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Public Info -->
      <div v-if="!result" class="grid md:grid-cols-3 gap-8 py-8 animate-fade-up" style="animation-delay: 200ms">
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
  IconFileText, IconShieldOff, IconX, IconHash,
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
const verifyMode = ref<'file' | 'hash'>('file')
const hashInput = ref('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)
const copied = ref(false)

const triggerFileSelect = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    file.value = target.files[0]
    result.value = null
    error.value = null
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files.length) {
    file.value = e.dataTransfer.files[0]
    result.value = null
    error.value = null
  }
}

const handleVerifyFile = async () => {
  if (!file.value) return
  loading.value = true
  error.value = null

  try {
    const success = await store.verifyDocument(file.value)
    if (success) {
      result.value = store.verificationResult
    } else {
      error.value = store.error
    }
  } finally {
    loading.value = false
  }
}

const handleVerifyHash = async () => {
  if (!hashInput.value) return
  loading.value = true
  error.value = null

  try {
    const success = await store.verifyDocumentByHash(hashInput.value)
    if (success) {
      result.value = store.verificationResult
    } else {
      error.value = store.error
    }
  } finally {
    loading.value = false
  }
}

const reset = () => {
  file.value = null
  hashInput.value = ''
  result.value = null
  error.value = null
  store.error = null
  store.verificationResult = null
}

const truncateHash = (hash: string) => {
  if (!hash) return ''
  if (hash.length <= 24) return hash
  return hash.substring(0, 12) + '...' + hash.substring(hash.length - 12)
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
