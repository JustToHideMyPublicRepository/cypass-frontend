<template>
  <UiBaseModal :show="show" title="Authentifier un document" maxWidth="md" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <div v-if="!file"
        class="border-2 border-dashed border-ashAct rounded-3xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group"
        @click="triggerFileSelect" @dragover.prevent @drop.prevent="handleDrop">
        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
        <div
          class="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
          <IconUpload class="w-8 h-8" />
        </div>
        <p class="font-bold text-BtW">Cliquez ou glissez un fichier</p>
        <p class="text-xs text-hsa mt-1">PDF uniquement (Max 3MB)</p>
      </div>

      <div v-else class="bg-ash/20 rounded-2xl p-4 border border-ash">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <IconFileText class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-BtW truncate">{{ file.name }}</p>
            <p class="text-xs text-hsa">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
          <button @click="file = null" class="text-hsa hover:text-danger p-2">
            <IconX class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="uploadResult" class="p-4 rounded-2xl bg-success/5 border border-success/20 animate-fade-up">
        <div class="flex items-center gap-3 text-success mb-3">
          <IconCircleCheck class="w-5 h-5" />
          <span class="font-bold text-sm">Document certifié avec succès !</span>
        </div>
        <div class="space-y-2 text-[11px]">
          <div class="flex justify-between">
            <span class="text-hsa">ID Document:</span>
            <span class="font-mono text-BtW">{{ uploadResult.document_id }}</span>
          </div>
          <div class="flex justify-between items-center group/hash">
            <span class="text-hsa">Hash (SHA-256):</span>
            <div class="flex items-center gap-2">
              <span class="font-mono text-BtW truncate max-w-[120px]" :title="uploadResult.doc_hash">
                {{ uploadResult.doc_hash }}
              </span>
              <button @click="copyHash(uploadResult.doc_hash)"
                class="p-1 hover:bg-primary/10 text-hsa hover:text-primary rounded transition-colors"
                title="Copier le hash">
                <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
                <IconCheck v-else class="w-3.5 h-3.5 text-success" />
              </button>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-hsa">Algorithme:</span>
            <span class="font-bold text-BtW">{{ uploadResult.cryptographic_proof.algorithm }}</span>
          </div>
          <div class="space-y-1 mt-2 pt-2 border-t border-success/10">
            <p class="text-[10px] text-hsa uppercase font-bold">Signature Numérique</p>
            <p class="font-mono text-[9px] break-all text-BtW bg-WtB/50 p-2 rounded border border-success/10">
              {{ uploadResult.cryptographic_proof.digital_signature }}
            </p>
          </div>
          <div class="flex justify-between items-center mt-1">
            <span class="text-[10px] text-hsa uppercase font-bold">Empreinte Clé</span>
            <span class="font-mono text-[10px] text-BtW">{{ uploadResult.cryptographic_proof.key_fingerprint }}</span>
          </div>
        </div>
      </div>

      <div v-if="loading && !uploadResult" class="py-4 animate-fade-in">
        <div class="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p class="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Certification en cours
          </p>
          <UtilsStepProgress :steps="activeSteps" />
        </div>
      </div>

      <div v-if="error"
        class="p-4 rounded-2xl bg-danger/5 border border-danger/20 text-danger text-sm flex items-center gap-3">
        <IconAlertCircle class="w-5 h-5 shrink-0" />
        <p>{{ error }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <UiBaseButton variant="secondary" block @click="close">Annuler</UiBaseButton>
        <UiBaseButton variant="primary" block :loading="loading" :disabled="!file || !!uploadResult"
          @click="handleUpload">
          Signer le document
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IconUpload, IconFileText, IconCircleCheck, IconAlertCircle, IconX,
  IconCopy, IconCheck
} from '@tabler/icons-vue'
import { authSteps, type Step } from '~/utils/docsentry'

const props = defineProps<{
  show: boolean
  loading: boolean
  error: string | null
  uploadResult: any
}>()

const emit = defineEmits(['close', 'upload', 'update:error', 'error-clear'])

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(authSteps)))

const resetSteps = () => {
  activeSteps.value = JSON.parse(JSON.stringify(authSteps))
}

const runSteps = async () => {
  for (let i = 0; i < activeSteps.value.length; i++) {
    activeSteps.value[i].status = 'loading'
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
    activeSteps.value[i].status = 'completed'
  }
}

const triggerFileSelect = () => fileInput.value?.click()

const validateFile = (selectedFile: File): boolean => {
  emit('error-clear')

  if (selectedFile.type !== 'application/pdf') {
    emit('update:error', 'Seuls les fichiers PDF sont acceptés.')
    return false
  }

  if (selectedFile.size > 3 * 1024 * 1024) {
    emit('update:error', 'La taille du fichier ne doit pas dépasser 3 Mo.')
    return false
  }

  return true
}

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

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files.length) {
    const selectedFile = e.dataTransfer.files[0]
    if (validateFile(selectedFile)) {
      file.value = selectedFile
    } else {
      file.value = null
    }
  }
}

const handleUpload = async () => {
  if (file.value) {
    resetSteps()
    emit('upload', file.value)
    await runSteps()
  }
}

const copyHash = (hash: string) => {
  navigator.clipboard.writeText(hash)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const close = () => {
  file.value = null
  copied.value = false
  resetSteps()
  emit('close')
}
</script>
