<template>
  <UiBaseModal :show="show" title="Certification enrichie" maxWidth="2xl" @close="handleClose">
    <!-- Result View -->
    <div v-if="uploadResult" class="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar py-2">
      <ModalDocsentryEnrichedAuthResult :result="uploadResult" :category="form.category" :metadata="form.metadata" />

      <div class="pt-6">
        <UiBaseButton variant="primary" class="w-full !rounded-2xl font-black py-4 h-auto shadow-xl"
          @click="handleClose">
          D'accord
        </UiBaseButton>
      </div>
    </div>

    <!-- Step Indicator -->
    <ModalDocsentryEnrichedAuthStepIndicator v-if="!uploadResult" :steps="steps" :current-step="currentStep"
      :is-step-accessible="isStepAccessible" @select-step="currentStep = $event" />

    <!-- Step 1: Category Selection -->
    <ModalDocsentryEnrichedAuthCategory v-if="currentStep === 1 && !uploadResult"
      :categories="publicStore.enrichmentCategories" :selected-category="form.category"
      :loading="publicStore.loadingCategories" @select="selectCategory" @next="currentStep = 2" />

    <!-- Step 2: File Selection -->
    <ModalDocsentryEnrichedAuthFileUpload v-if="currentStep === 2" v-model:file="form.file" :category="form.category"
      @back="currentStep = 1" @next="handleGoToExtraction" @error="handleFileError" />

    <!-- Step 3: Extraction -->
    <ModalDocsentryEnrichedAuthExtracting v-if="currentStep === 3" :category="form.category" />

    <!-- Step 4: Metadata -->
    <div v-if="currentStep === 4" class="space-y-6">
      <ModalDocsentryEnrichedAuthMetadata :category="form.category" v-model="form.metadata" :loading="loading"
        @back="currentStep = 2" @submit="handleSubmit" />

      <div v-if="store.error"
        class="p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger">
        <IconAlertCircle class="w-5 h-5 shrink-0" />
        <p class="text-xs font-medium">{{ store.error }}</p>
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

const steps = [
  { id: 1, label: 'Catégorie' },
  { id: 2, label: 'Fichier' },
  { id: 3, label: 'Extraction' },
  { id: 4, label: 'Données' }
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

const isStepAccessible = (stepId: number): boolean => {
  if (stepId === 1) return true
  if (stepId === 2) return !!form.category
  if (stepId === 3) return !!form.category && !!form.file
  if (stepId === 4) return !!form.category && !!form.file
  return false
}

const handleFileError = (err: any) => {
  fileErrorTitle.value = err.title
  fileErrorMessage.value = err.message
  errorFileName.value = err.file.name
  errorFileType.value = err.file.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (err.file.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

// Gestion des fichiers déposés via le DropZone global
const onDroppedFile = (droppedFile: File) => {
  if (!loading.value && currentStep.value === 2) {
    // Note: Validation is now partially handled in the sub-component, but we use a simpler one here for dropzone
    if (droppedFile.type === 'application/pdf' && droppedFile.size <= 3 * 1024 * 1024) {
      form.file = droppedFile
      store.error = null
    } else {
      handleFileError({
        title: droppedFile.type !== 'application/pdf' ? 'Format non supporté' : 'Fichier trop volumineux',
        message: droppedFile.type !== 'application/pdf' ? 'PDF uniquement.' : 'Max 3 Mo.',
        file: droppedFile
      })
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
    store.error = null
  }, 300)
}

const handleGoToExtraction = async () => {
  if (!form.file || !form.category) return
  currentStep.value = 3

  const extractedData = await store.extractMetadata(form.file, form.category.key)

  if (extractedData) {
    // Fusionner les données extraites avec les métadonnées existantes
    Object.keys(form.metadata).forEach(key => {
      if (extractedData[key]) {
        form.metadata[key] = extractedData[key]
      }
    })
  }

  currentStep.value = 4
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
