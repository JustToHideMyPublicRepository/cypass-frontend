<template>
  <UiBaseModal :show="show" title="Authentifier un document" maxWidth="2xl" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Zone de dépôt de fichier -->
      <div v-if="!file"
        class="relative border-4 border-dashed border-primary/10 rounded-[2.5rem] p-12 text-center hover:border-primary/40 transition-all cursor-pointer bg-ash/20 hover:bg-primary/5 group overflow-hidden"
        @click="triggerFileSelect">

        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">

        <div class="pointer-events-none relative z-10">
          <div
            class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-ash">
            <IconUpload class="w-10 h-10" />
          </div>
          <p class="text-xl font-black text-BtW tracking-tighter">Cliquez ou glissez un fichier</p>
          <p class="text-[10px] text-hsa mt-2 font-black tracking-widest opacity-60">PDF uniquement • Max 3 Mo
          </p>
        </div>

        <!-- Effet de background subtil au survol -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        </div>
      </div>

      <!-- Aperçu du fichier sélectionné -->
      <div v-else class="bg-ash/30 rounded-[2rem] p-5 border border-ashAct/30 backdrop-blur-sm">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <IconFileText class="w-7 h-7" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-black text-BtW truncate text-sm tracking-tight">{{ file.name }}</p>
            <p class="text-[10px] text-hsa font-bold tracking-widest opacity-70">{{ (file.size / 1024 /
              1024).toFixed(2) }} MB</p>
          </div>
          <UiBaseButton @click="file = null" variant="ghost"
            class="!text-hsa hover:!text-danger !p-3 !h-auto !w-auto !rounded-xl transition-colors">
            <IconX class="w-6 h-6" />
          </UiBaseButton>
        </div>
      </div>

      <!-- Résultat de l'authentification -->
      <div v-if="uploadResult"
        class="p-6 rounded-[2rem] bg-success/5 border-2 border-success/20 animate-fade-up shadow-lg shadow-success/5">
        <div class="flex items-center gap-4 text-success mb-5">
          <div class="p-2 bg-success/10 rounded-xl">
            <IconCircleCheck class="w-6 h-6" />
          </div>
          <span class="font-black text-sm tracking-widest">Document certifié avec succès</span>
        </div>

        <div class="space-y-4 text-[11px]">
          <div class="flex justify-between items-center py-2 border-b border-success/10">
            <span class="text-hsa font-bold tracking-widest">ID Document</span>
            <span class="font-code text-BtW bg-success/5 px-2 py-1 rounded-lg border border-success/10">{{
              uploadResult.document_id }}</span>
          </div>

          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between items-center group/hash">
              <span class="text-hsa font-bold tracking-widest">Hash (SHA-256)</span>
              <UiBaseButton @click="copyHash(uploadResult.doc_hash)" variant="ghost"
                class="!p-1.5 hover:!bg-primary/10 text-primary rounded-lg transition-all !h-auto !w-auto flex items-center gap-2"
                title="Copier le hash">
                <span class="text-[9px] font-black uppercase">{{ copied ? 'Copié' : 'Copier' }}</span>
                <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
                <IconCheck v-else class="w-3.5 h-3.5 text-success" />
              </UiBaseButton>
            </div>
            <div
              class="font-code text-BtW break-all bg-WtB/50 p-3 rounded-xl border border-ashAct/30 leading-relaxed shadow-sm">
              {{ uploadResult.doc_hash }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 py-3">
            <div class="p-3 bg-ash/20 rounded-xl border border-ashAct/20">
              <span class="text-[9px] text-hsa font-black block mb-1">Algorithme</span>
              <span class="font-black text-BtW uppercase">{{ uploadResult.cryptographic_proof.algorithm }}</span>
            </div>
            <div class="p-3 bg-ash/20 rounded-xl border border-ashAct/20 text-right">
              <span class="text-[9px] text-hsa font-black block mb-1">Empreinte Clé</span>
              <span class="font-code text-BtW">{{ uploadResult.cryptographic_proof.key_fingerprint }}</span>
            </div>
          </div>

          <div class="space-y-2 mt-2">
            <p class="text-[10px] text-hsa font-black tracking-[0.2em] ml-1">Signature Numérique</p>
            <p
              class="font-code text-[10px] break-all text-BtW bg-BtW/5 text-ashAct/10 p-4 rounded-2xl border border-ashAct/20 shadow-inner">
              {{ uploadResult.cryptographic_proof.digital_signature }}
            </p>
          </div>
        </div>
      </div>

      <!-- État de chargement (Progression) -->
      <div v-if="loading && !uploadResult" class="py-4 animate-fade-in">
        <div class="mb-6 p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10 shadow-xl shadow-primary/5">
          <p class="text-xs font-black text-primary tracking-[0.2em] mb-6 flex items-center gap-3">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Certification en cours sur la Blockchain
          </p>
          <UtilsStepProgress :steps="activeSteps" />
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error"
        class="p-5 rounded-[1.5rem] bg-danger/5 border-2 border-danger/20 text-danger text-sm flex items-center gap-4 animate-shake">
        <div class="p-2 bg-danger/10 rounded-xl">
          <IconAlertCircle class="w-6 h-6 shrink-0" />
        </div>
        <p class="font-bold">{{ error }}</p>
      </div>
    </div>

    <!-- Actions du pied de page -->
    <template #footer>
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <UiBaseButton variant="ghost" class="flex-1 !rounded-2xl font-bold py-4 h-auto border-none" @click="close">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading"
          :disabled="!file || !!uploadResult" @click="handleUpload">
          Signer le document
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage" :file-name="errorFileName"
    :file-type="errorFileType" :file-size="errorFileSize" :accepted-formats="'PDF uniquement (Max 3 Mo)'"
    @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import {
  IconUpload, IconFileText, IconCircleCheck, IconAlertCircle, IconX,
  IconCopy, IconCheck
} from '@tabler/icons-vue'
import { authSteps, type Step } from '~/utils/docsentry'
import { useGlobalDropZone } from '~/composables/useDropZone'

// Propriétés de la modale DocSentryAuth
const props = defineProps<{
  show: boolean
  loading: boolean
  error: string | null
  uploadResult: any
}>()

const emit = defineEmits(['close', 'upload', 'update:error', 'error-clear'])

// États locaux
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(authSteps)))

const { enable, disable } = useGlobalDropZone()

// Gestion des fichiers déposés via le DropZone global
const onDroppedFile = (droppedFile: File) => {
  if (!props.loading) {
    if (validateFile(droppedFile)) {
      file.value = droppedFile
      emit('error-clear')
    }
  }
}

// Surveillance de la visibilité pour activer/désactiver le DropZone
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
const showError = (title: string, message: string, file: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = file.name
  errorFileType.value = file.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

/**
 * Réinitialise les étapes de progression
 */
const resetSteps = () => {
  activeSteps.value = JSON.parse(JSON.stringify(authSteps))
}

/**
 * Simule visuellement l'avancement des étapes (pour l'UI)
 */
const runSteps = async () => {
  for (let i = 0; i < activeSteps.value.length; i++) {
    activeSteps.value[i].status = 'loading'
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
    activeSteps.value[i].status = 'completed'
  }
}

const triggerFileSelect = () => fileInput.value?.click()

/**
 * Validation robuste du fichier sélectionné
 */
const validateFile = (selectedFile: File): boolean => {
  emit('error-clear')

  if (selectedFile.type !== 'application/pdf') {
    showError(
      'Format non supporté',
      `Le fichier "${selectedFile.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour l'authentification.`,
      selectedFile
    )
    emit('update:error', 'Seuls les fichiers PDF sont acceptés.')
    return false
  }

  if (selectedFile.size > 3 * 1024 * 1024) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(selectedFile.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 3 Mo.`,
      selectedFile
    )
    emit('update:error', 'La taille du fichier ne doit pas dépasser 3 Mo.')
    return false
  }

  return true
}

/**
 * Gestion du changement d'input fichier standard
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
 * Lance le processus d'upload et signature
 */
const handleUpload = async () => {
  if (file.value) {
    resetSteps()
    emit('upload', file.value)
    await runSteps()
  }
}

/**
 * Copie le hash dans le presse-papier
 */
const copyHash = (hash: string) => {
  navigator.clipboard.writeText(hash)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

/**
 * Ferme la modale et réinitialise l'état
 */
const close = () => {
  file.value = null
  copied.value = false
  resetSteps()
  emit('close')
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
