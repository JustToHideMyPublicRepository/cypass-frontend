<template>
  <div class="glass-panel p-6 md:p-12 rounded-3xl md:rounded-[40px] border border-ashAct shadow-2xl relative group">
    <!-- Sélecteur de mode -->
    <RootVerifyModeSelector v-if="!result && !loading" :modelValue="verifyMode"
      @update:modelValue="$emit('update:verifyMode', $event as any)" />

    <!-- Sélecteur de sous-mode PDF -->
    <RootVerifySubModeSelector v-if="!result && !loading && verifyMode === 'file'" :modelValue="pdfSubMode"
      @update:modelValue="$emit('update:pdfSubMode', $event as any)" />

    <!-- Zone de dépôt interactive (Drag & Drop) -->
    <div v-if="!activeFile && (verifyMode === 'file' || verifyMode === 'qr') && !result && !isCameraMode"
      class="relative border-2 border-dashed border-primary/20 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center hover:border-primary/50 transition-all cursor-pointer bg-WtB/50 hover:bg-primary/5 group overflow-hidden"
      @click="$emit('trigger-file')">

      <div class="pointer-events-none">
        <div
          class="w-16 h-16 md:w-20 md:h-20 bg-WtB rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 transition-transform duration-500">
          <IconRosetteDiscountCheck v-if="verifyMode === 'file'" class="w-8 h-8 md:w-10 md:h-10" />
          <IconQrcode v-else class="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h3 class="text-lg md:text-xl font-bold text-BtW mb-2">
          {{ verifyMode === 'file'
            ? (pdfSubMode === 'original' ? 'Sélectionnez le document complet' : 'Sélectionnez le certificat PDF')
            : 'Sélectionnez l\'image du QR Code' }}
        </h3>
        <p class="text-xs md:text-sm text-hsa">
          {{ verifyMode === 'file'
            ? 'Glissez-déposez le fichier PDF ici ou cliquez pour parcourir'
            : 'Glissez-déposez l\'image (PNG, JPG) ici ou cliquez pour parcourir' }}
        </p>

        <div v-if="verifyMode === 'qr'" class="mt-8 flex justify-center pointer-events-auto">
          <UiBaseButton variant="accent" size="sm" @click.stop="isCameraMode = true">
            <template #icon>
              <IconCamera class="w-4 h-4" />
            </template>
            Utiliser la caméra
          </UiBaseButton>
        </div>
      </div>

      <input type="file" ref="fileInput" class="hidden"
        :accept="verifyMode === 'file' ? '.pdf,application/pdf' : '.png,.jpg,.jpeg,image/*'" @change="handleFileChange">
    </div>

    <!-- Zone de caméra -->
    <div v-if="isCameraMode && verifyMode === 'qr' && !result && !activeFile" class="py-4">
      <RootVerifyCameraScanner @capture="handleCameraCapture" @cancel="isCameraMode = false" />
    </div>

    <!-- Zone de saisie d'empreinte (Hash) -->
    <div v-if="verifyMode === 'hash' && !result && !activeFile" class="max-w-md mx-auto space-y-4 py-8">
      <div class="space-y-2 text-left">
        <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Code SHA-256 du document</label>
        <div class="relative">
          <IconHash class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <input :value="hashInput" @input="$emit('update:hashInput', ($event.target as HTMLInputElement).value)"
            type="text"
            class="w-full h-12 pl-12 pr-4 py-4 rounded-2xl bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-code text-sm"
            placeholder="Entrez l'empreinte numérique...">
        </div>
      </div>
      <UiBaseButton block size="lg" :disabled="!hashInput || hashInput.length < 10" @click="$emit('verify-hash')">
        Vérifier l'empreinte
      </UiBaseButton>
    </div>

    <div v-if="(activeFile || result || (loading && verifyMode === 'hash'))" class="space-y-8">
      <!-- En-tête du fichier sélectionné (Uniquement pour le mode fichier) -->
      <RootVerifyFilePreview :file="activeFile" :mode="verifyMode" @reset="$emit('reset')"
        v-if="activeFile && !result" />

      <!-- État de chargement (Étapes de progression) -->
      <RootVerifyProgressSteps v-if="loading && !result" :steps="activeSteps" />

      <RootVerifyResult v-if="result" :result="result" :error="error" @reset="$emit('reset')" />

      <div v-if="!loading && !result && activeFile" class="flex justify-center pt-4">
        <UiBaseButton size="lg" class="px-12" @click="$emit('verify-file')">Vérifier le document</UiBaseButton>
      </div>
    </div>

    <!-- Modale d'erreur de fichier -->
    <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
      :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
      :accepted-formats="acceptedFormats" @close="showFileError = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { IconRosetteDiscountCheck, IconHash, IconFileText, IconX, IconQrcode, IconChevronDown, IconCamera } from '@tabler/icons-vue'
import type { Step } from '~/utils/docsentry'

import { useGlobalDropZone } from '~/composables/useDropZone'

const { enable, disable } = useGlobalDropZone()

const onDroppedFile = (droppedFile: File) => {
  if (props.loading) return

  if (validateFile(droppedFile)) {
    if (props.verifyMode === 'file') {
      emit('update:pdfFile', droppedFile)
    } else if (props.verifyMode === 'qr') {
      emit('update:qrFile', droppedFile)
    }
  }
}

onMounted(() => {
  enable(onDroppedFile)
})

onUnmounted(() => {
  disable(onDroppedFile)
})

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB for PDF files

const props = defineProps<{
  verifyMode: 'file' | 'hash' | 'qr'
  pdfSubMode: 'original' | 'certificate'
  hashInput: string
  pdfFile: File | null
  qrFile: File | null
  loading: boolean
  result: any
  error: string | null
  activeSteps: Step[]
}>()

const activeFile = computed(() => {
  if (props.verifyMode === 'file') return props.pdfFile
  if (props.verifyMode === 'qr') return props.qrFile
  return null
})

const emit = defineEmits(['update:verifyMode', 'update:pdfSubMode', 'update:hashInput', 'trigger-file', 'verify-hash', 'verify-file', 'reset', 'update:pdfFile', 'update:qrFile'])

const fileInput = ref<HTMLInputElement | null>(null)

// État de la modale d'erreur
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')
const acceptedFormats = ref('PDF, PNG, JPG (Max 3 Mo)')

const isCameraMode = ref(false)

const handleCameraCapture = (file: File) => {
  if (validateFile(file)) {
    emit('update:qrFile', file)
    isCameraMode.value = false
  }
}

watch(() => props.verifyMode, () => {
  isCameraMode.value = false
})

const showError = (title: string, message: string, file: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = file.name
  errorFileType.value = file.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

const validateFile = (file: File): boolean => {
  if (props.verifyMode === 'file') {
    if (file.type !== 'application/pdf') {
      showError(
        'Format non supporté',
        `Le fichier "${file.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour la vérification de document.`,
        file
      )
      return false
    }
  } else if (props.verifyMode === 'qr') {
    if (!file.type.startsWith('image/')) {
      showError(
        'Format non supporté',
        `Le fichier "${file.name}" n'est pas une image. Seuls les fichiers images (JPG, PNG) sont acceptés pour la vérification QR.`,
        file
      )
      return false
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(file.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 3 Mo.`,
      file
    )
    return false
  }

  return true
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const selectedFile = target.files[0]
    if (validateFile(selectedFile)) {
      if (props.verifyMode === 'file') {
        emit('update:pdfFile', selectedFile)
      } else if (props.verifyMode === 'qr') {
        emit('update:qrFile', selectedFile)
      }
    }
    target.value = '' // Réinitialisation de l'input
  }
}
</script>
```
