<template>
  <UiBaseModal :show="show" title="Authentifier un document" maxWidth="2xl" @close="close">
    <div class="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar space-y-6 py-2">
      <!-- Zone de dépôt de fichier -->
      <ModalDocsentryAuthDropZone v-if="!file" @select-file="triggerFileSelect" />

      <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">

      <!-- Aperçu du fichier sélectionné -->
      <ModalDocsentryAuthFilePreview v-if="file && !uploadResult" :file="file" @remove="file = null" />

      <!-- Résultat de l'authentification -->
      <ModalDocsentrySimpleAuthResult v-if="uploadResult" ref="authResultRef" :result="uploadResult"
        @update:loading="(val: boolean) => multiVersionLoading = val" />

      <!-- État de chargement (Progression) -->
      <ModalDocsentrySimpleAuthLoading v-if="loading && !uploadResult" :active-steps="activeSteps" />

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
      <ModalDocsentrySimpleAuthFooter :has-result="!!uploadResult" :loading="loading" :has-file="!!file"
        :multi-version-loading="multiVersionLoading" @close="close" @upload="handleUpload" />
    </template>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
    :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
    :accepted-formats="'PDF uniquement (Max 3 Mo)'" @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { IconAlertCircle } from '@tabler/icons-vue'
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
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(authSteps)))
const multiVersionLoading = ref(false)
const authResultRef = ref<any>(null)

const { enable, disable } = useGlobalDropZone()

// Gestion des fichiers déposés via le DropZone global
const onDroppedFile = (droppedFile: File) => {
  if (!props.loading && !props.uploadResult) {
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
 * Ferme la modale et réinitialise l'état
 */
const close = () => {
  if (multiVersionLoading.value) return

  file.value = null
  if (authResultRef.value) {
    authResultRef.value.resetForm()
  }
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
