<template>
  <div class="glass-panel p-8 md:p-12 rounded-[40px] border border-ashAct shadow-2xl relative group">
    <!-- Mode Switcher -->
    <div v-if="!result && !loading" class="flex justify-center mb-8">
      <div class="flex p-1 bg-ash/50 rounded-xl border border-ash">
        <button @click="$emit('update:verifyMode', 'file')"
          class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="verifyMode === 'file' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
          Fichier PDF
        </button>
        <button @click="$emit('update:verifyMode', 'hash')"
          class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="verifyMode === 'hash' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
          Empreinte (Hash)
        </button>
      </div>
    </div>

    <!-- Interactive Dropzone -->
    <div v-if="!file && verifyMode === 'file' && !result"
      class="relative border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer bg-WtB/50 hover:bg-primary/5 group overflow-hidden"
      @click="$emit('trigger-file')" @dragenter.prevent="handleDragEnter" @dragover.prevent
      @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">

      <!-- Drag Overlay -->
      <div v-if="isDragging"
        class="absolute inset-0 z-10 bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 pointer-events-none">
        <IconRosetteDiscountCheck class="w-16 h-16 text-WtB mb-4 animate-bounce" />
        <h3 class="text-2xl font-black text-WtB uppercase tracking-widest">Lâcher pour analyser</h3>
      </div>

      <div class="pointer-events-none">
        <div
          class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 transition-transform duration-500">
          <IconRosetteDiscountCheck class="w-10 h-10" />
        </div>
        <h3 class="text-xl font-bold text-BtW mb-2">Sélectionnez le document PDF</h3>
        <p class="text-sm text-hsa">Glissez-déposez le fichier ici ou cliquez pour parcourir</p>
      </div>

      <input type="file" ref="fileInput" class="hidden" accept=".pdf,application/pdf" @change="handleFileChange">
    </div>

    <!-- Hash Input Zone -->
    <div v-if="verifyMode === 'hash' && !result && !file" class="max-w-md mx-auto space-y-4 py-8">
      <div class="space-y-2 text-left">
        <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Code SHA-256 du document</label>
        <div class="relative">
          <IconHash class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <input :value="hashInput" @input="$emit('update:hashInput', ($event.target as HTMLInputElement).value)"
            type="text"
            class="w-full h-12 pl-12 pr-4 py-4 rounded-2xl bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
            placeholder="Entrez l'empreinte numérique...">
        </div>
      </div>
      <UiBaseButton block size="lg" :disabled="!hashInput || hashInput.length < 10" @click="$emit('verify-hash')">
        Vérifier l'empreinte
      </UiBaseButton>
    </div>

    <div v-if="(file || result || (loading && verifyMode === 'hash'))" class="space-y-8">
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
        <button @click="$emit('reset')" class="text-hsa hover:text-danger p-2 transition-colors">
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <!-- Loading State (Progress Steps) -->
      <div v-if="loading && !result" class="py-12 animate-fade-in max-w-sm mx-auto">
        <div class="mb-8 p-6 bg-primary/5 rounded-[32px] border border-primary/10 text-left">
          <p class="text-xs font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Analyse Cryptographique
          </p>
          <UtilsStepProgress :steps="activeSteps" />
        </div>
      </div>

      <RootVerifyResult v-if="result" :result="result" :error="error" @reset="$emit('reset')" />

      <div v-if="!loading && !result && file" class="flex justify-center pt-4">
        <UiBaseButton size="lg" class="px-12" @click="$emit('verify-file')">Vérifier le document</UiBaseButton>
      </div>
    </div>

    <!-- File Error Modal -->
    <ModalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage" :file-name="errorFileName"
      :file-type="errorFileType" :file-size="errorFileSize" :accepted-formats="acceptedFormats"
      @close="showFileError = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconRosetteDiscountCheck, IconHash, IconFileText, IconX } from '@tabler/icons-vue'
import type { Step } from '~/utils/docsentry'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB for PDF files

const props = defineProps<{
  verifyMode: 'file' | 'hash'
  hashInput: string
  file: File | null
  loading: boolean
  result: any
  error: string | null
  activeSteps: Step[]
}>()

const emit = defineEmits(['update:verifyMode', 'update:hashInput', 'trigger-file', 'verify-hash', 'verify-file', 'reset', 'update:file'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const dragCounter = ref(0) // Counter to fix flickering issue

watch([() => props.file, () => props.result, () => props.verifyMode], () => {
  isDragging.value = false
  dragCounter.value = 0
})

// Error modal state
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')
const acceptedFormats = ref('PDF uniquement (Max 10 Mo)')

const showError = (title: string, message: string, file: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = file.name
  errorFileType.value = file.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

const validateFile = (file: File): boolean => {
  if (file.type !== 'application/pdf') {
    showError(
      'Format non supporté',
      `Le fichier "${file.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour la vérification.`,
      file
    )
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(file.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 10 Mo.`,
      file
    )
    return false
  }

  return true
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  if (props.verifyMode === 'file' && !props.result) {
    dragCounter.value++
    isDragging.value = true
  }
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dragCounter.value--
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  dragCounter.value = 0

  if (e.dataTransfer?.files.length) {
    const file = e.dataTransfer.files[0]
    if (validateFile(file)) {
      emit('update:file', file)
    }
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    if (validateFile(file)) {
      emit('update:file', file)
    }
    target.value = '' // Reset input
  }
}
</script>
