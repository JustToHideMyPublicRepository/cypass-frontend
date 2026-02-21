<template>
  <UiBaseModal :show="show" title="Vérifier un document" maxWidth="2xl" @close="$emit('close')">
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
          <UiBaseButton @click="verifyMode = 'qr'" variant="ghost"
            class="!px-6 !py-2.5 !text-[10px] !font-black !tracking-widest !rounded-xl transition-all duration-300 !h-auto"
            :class="verifyMode === 'qr' ? '!bg-WtB !text-primary shadow-lg ring-1 ring-ashAct/10' : 'text-hsa hover:!text-BtW'">
            Code QR
          </UiBaseButton>
        </div>
      </div>

      <!-- Sélecteur de sous-mode PDF (Liste déroulante) -->
      <div v-if="!result && !loading && verifyMode === 'file'" class="max-w-xs mx-auto mb-6 px-2">
        <div class="space-y-2 text-left">
          <label class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] px-1 opacity-60">Type de
            document</label>
          <div class="relative group">
            <select v-model="pdfSubMode"
              class="w-full h-11 pl-4 pr-10 py-2 rounded-xl bg-ash/30 border border-ashAct/20 focus:ring-2 focus:ring-primary outline-none transition-all font-black text-[10px] appearance-none cursor-pointer tracking-widest">
              <option value="original">Document Original</option>
              <option value="certificate">Certificat CYPASS</option>
            </select>
            <IconChevronDown
              class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </div>

      <!-- Zone de dépôt pour fichier / QR -->
      <div v-if="!activeFile && (verifyMode === 'file' || verifyMode === 'qr') && !result"
        class="border-4 border-dashed border-primary/10 rounded-[2.5rem] p-12 text-center hover:border-primary/40 transition-all cursor-pointer group bg-ash/20 hover:bg-primary/5 overflow-hidden relative"
        @click="triggerFileSelect">
        <input type="file" ref="fileInput" class="hidden"
          :accept="verifyMode === 'file' ? '.pdf,application/pdf' : '.png,.jpg,.jpeg,image/*'"
          @change="handleFileChange">

        <div class="relative z-10 scale-110">
          <div
            class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <IconRosetteDiscountCheck v-if="verifyMode === 'file'" class="w-10 h-10" />
            <IconQrcode v-else class="w-10 h-10" />
          </div>
          <p class="font-black text-BtW text-xl tracking-tighter">
            {{ verifyMode === 'file'
              ? (pdfSubMode === 'original' ? 'Vérifier par document complet' : 'Vérifier par certificat PDF')
              : 'Vérifier par image QR' }}
          </p>
          <p class="text-[10px] text-hsa mt-2 tracking-[0.3em] font-black opacity-60">
            {{ verifyMode === 'file' ? 'Glissez le fichier PDF ici' : 'Glissez l\'image du QR ici' }}
          </p>
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

      <div v-if="(activeFile || result || (loading && verifyMode === 'hash'))" class="space-y-6">
        <!-- Affichage du fichier sélectionné -->
        <div v-if="activeFile && !result"
          class="p-6 bg-ash/30 rounded-[2rem] border border-ashAct/20 flex items-center gap-6 animate-fade-in text-left">
          <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <IconFileText v-if="verifyMode === 'file'" class="w-10 h-10" />
            <IconQrcode v-else class="w-10 h-10" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-black text-BtW truncate">{{ activeFile.name }}</p>
            <p class="text-xs text-hsa uppercase tracking-widest opacity-60 mt-1">{{ (activeFile.size / 1024 /
              1024).toFixed(2) }} MO</p>
          </div>
          <UiBaseButton @click="resetCurrentFile" variant="ghost"
            class="!p-3 !h-auto !w-auto text-hsa hover:!text-danger transition-colors opacity-40 hover:opacity-100">
            <IconX class="w-6 h-6" />
          </UiBaseButton>
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
                  {{ result.document?.signer || 'CYPASS' }}</strong>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-success/10">
                <div v-if="result.document?.id" class="space-y-1.5 p-3 bg-ash/20 rounded-xl border border-ashAct/20">
                  <p class="text-[9px] text-hsa font-black tracking-widest opacity-60">ID Certification</p>
                  <p class="font-code text-BtW break-all">{{ result.document?.id || result.id || 'N/A' }}</p>
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
                  {{ result.document?.hash || result.doc_hash || result.calculated_hash || 'Invalide' }}
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
            <div v-if="error || result.error || result.message"
              class="mt-5 p-4 bg-danger/10 rounded-2xl text-[11px] font-code text-danger border border-danger/20">
              <p v-if="result.mode" class="mb-2 opacity-60 uppercase font-black tracking-tighter">[ MODE: {{ result.mode
              }} ]</p>
              <p class="font-bold mb-1">{{ error || result.error || result.message }}</p>
              <p v-if="result.details" class="opacity-80">{{ result.details }}</p>
            </div>
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
        <UiBaseButton v-if="(verifyMode === 'file' || verifyMode === 'qr') && activeFile" variant="primary"
          class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading"
          @click="handleVerifyInternalFile">
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
  <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
    :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
    :accepted-formats="'PDF, PNG, JPG (Max 3 Mo)'" @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue'
import {
  IconSearch, IconFileText, IconShieldOff, IconX, IconHash,
  IconCopy, IconCheck, IconRosetteDiscountCheck, IconQrcode, IconChevronDown
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'
import { verifySteps, type Step } from '~/utils/docsentry'
import { useGlobalDropZone } from '~/composables/useDropZone'

const { enable, disable } = useGlobalDropZone()

// Propriétés de la modale DocSentryVerify
const props = defineProps<{
  show: boolean
  result: any
}>()

const emit = defineEmits(['close', 'verify', 'reset'])

const store = useDocumentsStore()
const verifyMode = ref<'file' | 'hash' | 'qr'>('file')
const pdfSubMode = ref<'original' | 'certificate'>('original')
const hashInput = ref('')
const pdfFile = ref<File | null>(null)
const qrFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(verifySteps)))

const result = ref<any>(props.result)
const loading = ref(false)
const error = ref<string | null>(null)

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
  if (verifyMode.value === 'file') {
    if (selectedFile.type !== 'application/pdf') {
      showError(
        'Format non supporté',
        `Le fichier "${selectedFile.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour la vérification de document.`,
        selectedFile
      )
      return false
    }
  } else if (verifyMode.value === 'qr') {
    if (!selectedFile.type.startsWith('image/')) {
      showError(
        'Format non supporté',
        `Le fichier "${selectedFile.name}" n'est pas une image. Seuls les fichiers images (JPG, PNG) sont acceptés pour la vérification QR.`,
        selectedFile
      )
      return false
    }
  }

  if (selectedFile.size > 3 * 1024 * 1024) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(selectedFile.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 3 Mo.`,
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

const activeFile = computed(() => {
  if (verifyMode.value === 'file') return pdfFile.value
  if (verifyMode.value === 'qr') return qrFile.value
  return null
})

watch(() => props.result, (newVal) => {
  result.value = newVal
})

const resetCurrentFile = () => {
  if (verifyMode.value === 'file') pdfFile.value = null
  else if (verifyMode.value === 'qr') qrFile.value = null
  if (fileInput.value) fileInput.value.value = '' // Clear the file input
}

watch(verifyMode, () => {
  // Clear only transient states when mode changes
  hashInput.value = ''
  error.value = null
  result.value = null
  emit('reset') // This will clear props.result
  if (fileInput.value) fileInput.value.value = '' // Clear the file input
})

watch(pdfFile, () => {
  error.value = null
  result.value = null
  emit('reset')
})

watch(qrFile, () => {
  error.value = null
  result.value = null
  emit('reset')
})

/**
 * Réinitialise l'état local et global de vérification
 */
const handleReset = () => {
  pdfFile.value = null
  qrFile.value = null
  hashInput.value = ''
  error.value = null
  result.value = null
  emit('reset')
  if (fileInput.value) fileInput.value.value = '' // Clear the file input
}

/**
 * Gère la sélection manuelle de fichier
 */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const selectedFile = target.files[0]
    if (validateFile(selectedFile)) {
      if (verifyMode.value === 'file') pdfFile.value = selectedFile
      else if (verifyMode.value === 'qr') qrFile.value = selectedFile
    } else {
      // If validation fails, clear the input
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

/**
 * Gère les fichiers déposés via DropZone
 */
const onDroppedFile = (droppedFile: File) => {
  if (loading.value) return
  if (validateFile(droppedFile)) {
    if (verifyMode.value === 'file') pdfFile.value = droppedFile
    else if (verifyMode.value === 'qr') qrFile.value = droppedFile
    error.value = null // Clear any previous error
    emit('reset') // This will clear props.result
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
 * Lance la vérification par fichier ou QR
 */
const handleVerifyInternalFile = async () => {
  if (!activeFile.value) return

  loading.value = true
  error.value = null
  resetSteps()

  try {
    let promise: Promise<boolean>

    if (verifyMode.value === 'qr') {
      promise = store.verifyDocumentByQR(activeFile.value)
    } else {
      if (pdfSubMode.value === 'original') {
        promise = store.verifyDocumentFull(activeFile.value, null)
      } else {
        promise = store.verifyDocumentFull(null, activeFile.value)
      }
    }

    await runSteps()
    const success = await promise

    if (success) {
      result.value = store.verificationResult
    } else {
      error.value = store.error
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur de vérification'
  } finally {
    loading.value = false
  }
}

/**
 * Lance la vérification par hash via le store Nuxt
 */
const handleVerifyInternalHash = async () => {
  if (!hashInput.value) return
  loading.value = true
  error.value = null
  resetSteps()

  try {
    const successPromise = store.verifyDocumentByHash(hashInput.value)
    await runSteps()
    const success = await successPromise

    if (success) {
      result.value = store.verificationResult
    } else {
      error.value = store.error
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur de vérification'
  } finally {
    loading.value = false
  }
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
  handleReset()
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
