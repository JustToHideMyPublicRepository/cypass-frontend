<template>
  <UiBaseModal :show="show" title="Certification enrichie" maxWidth="2xl" @close="handleClose">
    <!-- Result View -->
    <div v-if="uploadResult" class="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar py-2">
      <ModalDocsentryEnrichedAuthResult :result="uploadResult" :category="form.category" :metadata="form.metadata" />
      
      <div class="pt-6">
        <UiBaseButton variant="primary" class="w-full !rounded-2xl font-black py-4 h-auto shadow-xl" @click="handleClose">
          D'accord
        </UiBaseButton>
      </div>
    </div>

    <!-- Step Indicator (Hidden if result) -->
    <ModalDocsentryEnrichedAuthStepIndicator v-if="!uploadResult" :steps="steps" :current-step="currentStep" />

    <!-- Step 1: Category Selection -->
    <div v-if="currentStep === 1 && !uploadResult">
      <ModalDocsentryEnrichedAuthCategory :categories="publicStore.enrichmentCategories"
        :selected-category="form.category" :loading="publicStore.loadingCategories" @select="selectCategory" />

      <div class="flex justify-end pt-4">
        <UiBaseButton :disabled="!form.category || publicStore.loadingCategories" @click="currentStep = 2">Continuer
        </UiBaseButton>
      </div>
    </div>

    <!-- Step 2: File Selection -->
    <div v-if="currentStep === 2" class="space-y-6">
      <div class="space-y-4">
        <ModalDocsentryAuthDropZone v-if="!form.file" @select-file="triggerFileSelect" />
        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
        <ModalDocsentryAuthFilePreview v-if="form.file" :file="form.file" @remove="form.file = null" />
      </div>

      <div class="flex justify-between pt-4">
        <UiBaseButton variant="ghost" @click="currentStep = 1">Retour</UiBaseButton>
        <UiBaseButton :disabled="!form.file" @click="currentStep = 3">Continuer</UiBaseButton>
      </div>
    </div>

    <!-- Step 3: Metadata -->
    <div v-if="currentStep === 3" class="space-y-6">
      <ModalDocsentryEnrichedAuthMetadata :category="form.category" v-model="form.metadata" />

      <div v-if="store.error"
        class="p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger">
        <IconAlertCircle class="w-5 h-5 shrink-0" />
        <p class="text-xs font-medium">{{ store.error }}</p>
      </div>

      <div class="flex justify-between pt-4">
        <UiBaseButton variant="ghost" :disabled="loading" @click="currentStep = 2">Retour</UiBaseButton>
        <UiBaseButton :loading="loading" @click="handleSubmit">Lancer la certification</UiBaseButton>
      </div>
    </div>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
    :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
    :accepted-formats="'PDF uniquement (Max 3 Mo)'" @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from 'vue'
import { IconAlertCircle } from '@tabler/icons-vue'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { useGlobalDropZone } from '~/composables/useDropZone'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'success', 'error'])

const publicStore = usePublicDocsentryStore()
const store = useUserDocsentryStore()
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const steps = [
  { id: 1, label: 'Catégorie' },
  { id: 2, label: 'Fichier' },
  { id: 3, label: 'Données' }
]

const currentStep = ref(1)
const uploadResult = ref<any>(null)
const form = reactive({
  category: null as any,
  file: null as File | null,
  metadata: {} as Record<string, any>
})

const { enable, disable } = useGlobalDropZone()

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

// Gestion des fichiers déposés via le DropZone global
const onDroppedFile = (droppedFile: File) => {
  if (!loading.value && currentStep.value === 2) {
    if (validateFile(droppedFile)) {
      form.file = droppedFile
      store.error = null
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

const selectCategory = (cat: any) => {
  form.category = cat
  form.metadata = {}
  cat.fields.forEach((f: any) => {
    form.metadata[f.key] = ''
  })
}

const triggerFileSelect = () => fileInput.value?.click()

const validateFile = (selectedFile: File): boolean => {
  store.error = null

  if (selectedFile.type !== 'application/pdf') {
    showError(
      'Format non supporté',
      `Le fichier "${selectedFile.name}" n'est pas un PDF. Seuls les fichiers PDF sont acceptés pour la certification.`,
      selectedFile
    )
    return false
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

const handleFileChange = (e: any) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const selectedFile = target.files[0]
    if (validateFile(selectedFile)) {
      form.file = selectedFile
    } else {
      form.file = null
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

const handleClose = () => {
  if (loading.value) return
  emit('close')
  // Reset after animation
  setTimeout(() => {
    currentStep.value = 1
    uploadResult.value = null
    form.category = null
    form.file = null
    form.metadata = {}
  }, 300)
}

const handleSubmit = async () => {
  if (!form.file || !form.category) return

  loading.value = true
  store.error = null

  const success = await store.uploadEnrichedDocument(form.file, form.category.key, form.metadata)

  if (success) {
    uploadResult.value = store.uploadResult
    emit('success')
  }

  loading.value = false
}

// Ensure categories are fetched when modal opens
watch(() => props.show, (newVal) => {
  if (newVal && publicStore.enrichmentCategories.length === 0) {
    publicStore.fetchEnrichmentCategories()
  }
})
</script>
