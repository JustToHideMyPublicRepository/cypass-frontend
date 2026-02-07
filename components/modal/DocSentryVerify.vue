<template>
  <UiBaseModal :show="show" title="Vérifier un document" maxWidth="3xl" @close="$emit('close')">
    <div class="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar space-y-6 py-2">
      <!-- Sélecteur de mode de vérification -->
      <div v-if="!result && !loading" class="flex justify-center">
        <div class="flex p-1.5 bg-ash/50 rounded-2xl border-2 border-ashAct/20 gap-2 backdrop-blur-md">
          <UiBaseButton @click="verifyMode = 'file'" variant="ghost"
            class="!px-6 !py-2.5 !text-[10px] !font-black !tracking-widest !rounded-xl transition-all duration-300 !h-auto"
            :class="verifyMode === 'file' ? '!bg-WtB !text-primary shadow-lg ring-1 ring-ashAct/10' : 'text-hsa hover:!text-BtW'">
            Fichier
          </UiBaseButton>
          <UiBaseButton @click="verifyMode = 'hash'" variant="ghost"
            class="!px-6 !py-2.5 !text-[10px] !font-black !tracking-widest !rounded-xl transition-all duration-300 !h-auto"
            :class="verifyMode === 'hash' ? '!bg-WtB !text-primary shadow-lg ring-1 ring-ashAct/10' : 'text-hsa hover:!text-BtW'">
            Hash
          </UiBaseButton>
        </div>
      </div>

      <!-- Zone de dépôt pour fichier -->
      <div v-if="!file && verifyMode === 'file' && !result"
        class="border-4 border-dashed border-primary/10 rounded-[2.5rem] p-12 text-center hover:border-primary/40 transition-all cursor-pointer group bg-ash/20 hover:bg-primary/5 overflow-hidden relative"
        @click="triggerFileSelect">
        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">

        <div class="relative z-10 scale-110">
          <div
            class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <IconRosetteDiscountCheck class="w-10 h-10" />
          </div>
          <p class="font-black text-BtW text-xl tracking-tighter">Vérifier par fichier PDF</p>
          <p class="text-[10px] text-hsa mt-2 tracking-[0.3em] font-black opacity-60">Glissez le document
            signé ici</p>
        </div>

        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        </div>
      </div>

      <!-- Zone de saisie pour Hash -->
      <div v-else-if="verifyMode === 'hash' && !result" class="space-y-3 py-6 animate-fade-in px-2">
        <label class="text-[10px] font-black text-hsa tracking-[0.2em] ml-1">Code SHA-256 du document</label>
        <div class="relative group">
          <div
            class="absolute left-5 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
            <IconHash class="w-5 h-5" />
          </div>
          <input v-model="hashInput" type="text" class="input pl-14 font-code text-xs !lowercase"
            placeholder="Entrez le hash SHA-256 complet...">
        </div>
      </div>

      <div v-if="(file || result || (loading && verifyMode === 'hash'))" class="space-y-6">
        <!-- Entête du fichier sélectionné -->
        <div v-if="file && !result"
          class="bg-ash/30 rounded-[2rem] p-5 border border-ashAct/30 backdrop-blur-sm animate-scale-in">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <IconFileText class="w-7 h-7" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-black text-BtW truncate text-sm tracking-tight">{{ file.name }}</p>
              <p class="text-[10px] text-hsa font-black tracking-widest opacity-60">Prêt pour l'analyse
                cryptographique</p>
            </div>
            <UiBaseButton @click="handleReset" variant="ghost"
              class="!text-hsa hover:!text-danger !p-3 transition-colors !h-auto !w-auto !rounded-xl">
              <IconX class="w-6 h-6" />
            </UiBaseButton>
          </div>
        </div>

        <!-- État de chargement (Progression) -->
        <div v-if="loading && !result" class="py-4 animate-fade-in">
          <div class="mb-6 p-6 bg-primary/5 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-primary/5">
            <p class="text-xs font-black text-primary tracking-[0.2em] mb-8 flex items-center gap-3">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Vérification de l'intégrité globale
            </p>
            <UtilsStepProgress :steps="activeSteps" />
          </div>
        </div>

        <!-- Vue des Résultats -->
        <div v-if="result" class="animate-fade-up">
          <div v-if="result.verified"
            class="p-8 rounded-[2.5rem] bg-success/5 border-2 border-success/20 shadow-2xl shadow-success/5 relative overflow-hidden backdrop-blur-md">
            <!-- Filigrane de succès -->
            <div class="absolute -top-10 -right-10 p-4 opacity-5 rotate-12">
              <IconRosetteDiscountCheck class="w-48 h-48 text-success" />
            </div>

            <div class="flex items-center gap-4 text-success mb-8 relative z-10">
              <div class="p-3 bg-success/10 rounded-2xl">
                <IconRosetteDiscountCheck class="w-8 h-8" />
              </div>
              <span class="font-black text-lg tracking-tighter uppercase">Authenticité Confirmée</span>
            </div>

            <div class="space-y-6 text-[11px] leading-relaxed relative z-10">
              <div v-if="result.document?.filename"
                class="p-5 bg-primary/5 rounded-[1.5rem] border border-primary/10 shadow-inner">
                <p class="text-[9px] text-hsa font-black tracking-widest mb-1.5 opacity-60">Fichier
                  Authentifié</p>
                <p class="font-black text-BtW text-base truncate tracking-tight leading-none">{{
                  result.document.filename }}</p>
              </div>

              <div class="flex items-center justify-between px-2">
                <p class="text-hsa font-bold tracking-widest opacity-60">Émetteur Certifié</p>
                <strong class="text-BtW font-black text-xs">
                  {{ result.document?.signer || 'CYPASS TRUST NETWORK' }}</strong>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-success/10">
                <div v-if="result.document?.id" class="space-y-1.5 p-3 bg-ash/20 rounded-xl border border-ashAct/20">
                  <p class="text-[9px] text-hsa font-black tracking-widest opacity-60">ID Certification</p>
                  <p class="font-code text-BtW break-all">{{ result.document.id }}</p>
                </div>
                <div v-if="result.document?.created_at"
                  class="space-y-1.5 p-3 bg-ash/20 rounded-xl border border-ashAct/20">
                  <p class="text-[9px] text-hsa font-black tracking-widest opacity-60">Certifié le</p>
                  <p class="text-BtW font-black text-[10px] uppercase">{{ formatDate(result.document.created_at) }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center px-1">
                  <p class="text-[9px] text-hsa font-black tracking-widest opacity-60">Empreinte SHA-256</p>
                  <UiBaseButton v-if="result.document?.hash || result.doc_hash"
                    @click="copy(result.document?.hash || result.doc_hash)" variant="ghost"
                    class="!text-primary hover:!bg-primary/5 !font-black !tracking-widest !flex !items-center !gap-2 !px-3 !py-1 !rounded-lg !h-auto !w-auto !transition-all">
                    <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
                    <IconCheck v-else class="w-3.5 h-3.5 text-success" />
                    Copier le hash
                  </UiBaseButton>
                </div>
                <div
                  class="p-4 bg-ash/20 rounded-[1.5rem] border border-ashAct/30 font-code text-[10px] break-all text-hsa shadow-inner leading-relaxed">
                  {{ result.document?.hash || result.doc_hash || 'Hash indisponible' }}
                </div>
              </div>

              <!-- Bloc Détails Signature -->
              <div v-if="result.signature_info"
                class="mt-6 p-5 bg-BtW/5 rounded-[2rem] border border-ashAct/20 shadow-sm">
                <div class="flex justify-between mb-4 items-center">
                  <span class="text-hsa text-[10px] font-black tracking-widest opacity-60">Détails de la
                    Signature</span>
                  <span
                    class="bg-success text-white font-black text-[9px] px-3 py-1 rounded-full shadow-lg shadow-success/20">Ed25519
                    OK</span>
                </div>
                <div class="space-y-2.5">
                  <div class="flex justify-between text-[10px]">
                    <span class="text-hsa font-bold tracking-widest opacity-50">Algorithme</span>
                    <span class="text-BtW font-black">{{ result.signature_info.algorithm }}</span>
                  </div>
                  <div class="flex justify-between text-[10px]">
                    <span class="text-hsa font-bold tracking-widest opacity-50">Signé le</span>
                    <span class="text-BtW font-black">{{ formatDate(result.signature_info.signed_at) }}</span>
                  </div>
                  <div class="pt-2">
                    <span class="text-[9px] text-hsa font-black tracking-widest opacity-40 block mb-1">Empreinte
                      de la Clé de Signature</span>
                    <span class="font-code text-BtW select-all text-[10px] block p-2 bg-ash/40 rounded-lg truncate">{{
                      result.signature_info.key_fingerprint || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-6 text-center">
                <UiBaseButton @click="handleReset" variant="ghost"
                  class="!text-primary !text-[11px] !font-black !tracking-widest hover:!scale-105 transition-transform !bg-transparent !p-0 !h-auto">
                  <IconSearch class="w-4 h-4 mr-2" />
                  Nouvelle vérification
                </UiBaseButton>
              </div>
            </div>
          </div>

          <!-- Échec de la vérification -->
          <div v-else
            class="p-8 rounded-[2.5rem] bg-danger/5 border-2 border-danger/20 shadow-2xl shadow-danger/5 animate-shake">
            <div class="flex items-center gap-4 text-danger mb-4">
              <div class="p-3 bg-danger/10 rounded-2xl">
                <IconShieldOff class="w-8 h-8" />
              </div>
              <span class="font-black text-lg tracking-tighter uppercase">Validation Échouée</span>
            </div>
            <p class="text-sm text-hsa font-bold leading-relaxed px-1">Le document fourni n'est pas certifié par notre
              réseau ou a subi des modifications post-signature.</p>
            <div v-if="error"
              class="mt-5 p-4 bg-danger/10 rounded-2xl text-[11px] font-code text-danger border border-danger/20">{{
                error }}</div>
          </div>
        </div>
      </div>

      <!-- Erreurs contextuelles -->
      <div v-if="error && !result"
        class="p-5 rounded-[1.5rem] bg-danger/5 border-2 border-danger/20 text-danger text-sm font-bold animate-fade-in">
        {{ error }}
      </div>
    </div>

    <!-- Actions Footer -->
    <template #footer>
      <div v-if="!result" class="flex flex-col sm:flex-row gap-4 w-full">
        <UiBaseButton variant="ghost" class="flex-1 !rounded-2xl font-bold py-4 h-auto border-none" @click="close">
          Annuler</UiBaseButton>
        <UiBaseButton v-if="verifyMode === 'file' && file" variant="primary"
          class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading" @click="handleVerify">
          Analyser le document
        </UiBaseButton>
        <UiBaseButton v-else-if="verifyMode === 'hash'" variant="primary"
          class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading" :disabled="!hashInput"
          @click="handleVerifyInternalHash">
          Chercher le hash
        </UiBaseButton>
      </div>
      <div v-else class="w-full">
        <UiBaseButton variant="secondary" class="!rounded-2xl font-black py-4 h-auto" block @click="close">Fermer la
          console</UiBaseButton>
      </div>
    </template>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage" :file-name="errorFileName"
    :file-type="errorFileType" :file-size="errorFileSize" :accepted-formats="'PDF uniquement (Max 10 Mo)'"
    @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import {
  IconSearch, IconFileText, IconShieldOff, IconX, IconHash,
  IconCopy, IconCheck, IconRosetteDiscountCheck
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'
import { verifySteps, type Step } from '~/utils/docsentry'
import { useGlobalDropZone } from '~/composables/useDropZone'
import ModalFileError from '~/components/modal/FileError.vue'

const { enable, disable } = useGlobalDropZone()

// Propriétés de la modale DocSentryVerify
const props = defineProps<{
  show: boolean
  loading: boolean
  error: string | null
  result: any
}>()

const emit = defineEmits(['close', 'verify', 'reset'])

const store = useDocumentsStore()
const verifyMode = ref<'file' | 'hash'>('file')
const hashInput = ref('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(verifySteps)))

// États pour la modale d'erreur spécifique au fichier
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')

/**
 * Affiche la modale d'erreur personnalisée
 */
const showError = (title: string, message: string, f: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = f.name
  errorFileType.value = f.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (f.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

/**
 * Validation robuste du fichier sélectionné
 */
const validateFile = (selectedFile: File): boolean => {
  if (selectedFile.type !== 'application/pdf') {
    showError(
      'Format non supporté',
      `Le fichier "${selectedFile.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour la vérification.`,
      selectedFile
    )
    return false
  }

  if (selectedFile.size > 10 * 1024 * 1024) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(selectedFile.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 10 Mo.`,
      selectedFile
    )
    return false
  }

  return true
}

/**
 * Réinitialise les étapes de progression visuelle
 */
const resetSteps = () => {
  activeSteps.value = JSON.parse(JSON.stringify(verifySteps))
}

/**
 * Simule visuellement l'avancement des étapes (pour l'UI)
 */
const runSteps = async () => {
  for (let i = 0; i < activeSteps.value.length; i++) {
    activeSteps.value[i].status = 'loading'
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
    activeSteps.value[i].status = 'completed'
  }
}

const triggerFileSelect = () => fileInput.value?.click()

/**
 * Réinitialise l'état local et global de vérification
 */
const handleReset = () => {
  file.value = null
  hashInput.value = ''
  emit('reset')
}

/**
 * Gère la sélection manuelle de fichier
 */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const selectedFile = target.files[0]
    if (validateFile(selectedFile)) {
      file.value = selectedFile
    } else {
      file.value = null
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

/**
 * Gère les fichiers déposés via DropZone
 */
const onDroppedFile = (droppedFile: File) => {
  if (verifyMode.value === 'file' && !props.loading) {
    if (validateFile(droppedFile)) {
      file.value = droppedFile
      emit('reset')
    }
  }
}

// Surveillance de la visibilité pour DropZone
watch(() => props.show, (newVal) => {
  if (newVal) {
    enable(onDroppedFile)
  } else {
    disable(onDroppedFile)
  }
}, { immediate: true })

onUnmounted(() => {
  disable(onDroppedFile)
})

/**
 * Lance la vérification par fichier
 */
const handleVerify = async () => {
  if (file.value) {
    resetSteps()
    emit('verify', file.value)
    await runSteps()
  }
}

/**
 * Lance la vérification par hash via le store Nuxt
 */
const handleVerifyInternalHash = async () => {
  if (!hashInput.value) return
  resetSteps()
  const promise = store.verifyDocumentByHash(hashInput.value)
  await runSteps()
  await promise
}

/**
 * Copie le texte dans le presse-papier
 */
const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

/**
 * Ferme la modale et réinitialise tout
 */
const close = () => {
  file.value = null
  hashInput.value = ''
  resetSteps()
  emit('close')
}

/**
 * Formate la date selon les standards français (date + heure)
 */
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P p', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
