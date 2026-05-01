<template>
  <UiBaseModal :show="show" title="Certification enrichie" maxWidth="2xl" @close="handleClose">
    <!-- Step Indicator -->
    <div class="flex items-center justify-between mb-8 px-4">
      <div v-for="s in steps" :key="s.id" class="flex flex-col items-center gap-2 flex-1 relative">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10"
          :class="currentStep >= s.id ? 'bg-primary text-WtB shadow-lg shadow-primary/20' : 'bg-ash text-hsa'">
          {{ s.id }}
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider"
          :class="currentStep >= s.id ? 'text-primary' : 'text-hsa'">{{ s.label }}</span>
        <!-- Line -->
        <div v-if="s.id < 3" class="absolute top-4 left-1/2 w-full h-[2px] bg-ash -z-0">
          <div class="h-full bg-primary transition-all duration-500"
            :style="{ width: currentStep > s.id ? '100%' : '0%' }"></div>
        </div>
      </div>
    </div>

    <!-- Step 1: Category Selection -->
    <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
      <div v-if="publicStore.loadingCategories" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="p-4 rounded-xl border-2 border-ash/20 bg-ash/5 flex items-start gap-3">
          <UiAppSkeleton type="rect" width="40px" height="40px" class="rounded-lg" />
          <div class="flex-1 space-y-2">
            <UiAppSkeleton type="text" width="60%" />
            <UiAppSkeleton type="text" width="40%" height="10px" />
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button v-for="cat in publicStore.enrichmentCategories" :key="cat.key" @click="selectCategory(cat)"
          class="p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 group"
          :class="form.category?.key === cat.key ? 'border-primary bg-primary/5' : 'border-ash bg-ash/20 hover:border-primary/30'">
          <div class="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <component :is="getDocCategoryIcon(cat.key)" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-BtW text-sm">{{ cat.label }}</h4>
            <p class="text-[10px] text-hsa uppercase mt-1">{{ cat.fields.length }} champs requis</p>
          </div>
        </button>
      </div>
      <div class="flex justify-end pt-4">
        <UiBaseButton :disabled="!form.category || publicStore.loadingCategories" @click="currentStep = 2">Continuer
        </UiBaseButton>
      </div>
    </div>

    <!-- Step 2: File Selection -->
    <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
      <div class="space-y-4">
        <!-- Zone de dépôt de fichier -->
        <ModalDocsentryAuthDropZone v-if="!form.file" @select-file="triggerFileSelect" />

        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">

        <!-- Aperçu du fichier sélectionné -->
        <ModalDocsentryAuthFilePreview v-if="form.file" :file="form.file" @remove="form.file = null" />
      </div>

      <div class="flex justify-between pt-4">
        <UiBaseButton variant="ghost" @click="currentStep = 1">Retour</UiBaseButton>
        <UiBaseButton :disabled="!form.file" @click="currentStep = 3">Continuer</UiBaseButton>
      </div>
    </div>

    <!-- Step 3: Metadata -->
    <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
      <div v-if="!form.category" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 6" :key="i" class="space-y-2">
          <UiAppSkeleton type="text" width="40%" height="10px" class="ml-1" />
          <UiAppSkeleton type="rect" height="44px" class="rounded-xl" />
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="field in form.category?.fields" :key="field.key" class="space-y-1.5">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.15em] ml-1">
            {{ field.label }}
            <span v-if="field.required" class="text-danger">*</span>
          </label>
          <input v-if="field.type === 'text' || field.type === 'date'" v-model="form.metadata[field.key]"
            :type="field.type" :placeholder="field.label"
            class="w-full h-11 px-4 rounded-xl border border-ash bg-ash/50 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all outline-none"
            :required="field.required" />
        </div>
      </div>

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
import { ref, reactive, watch } from 'vue'
import { IconAlertCircle } from '@tabler/icons-vue'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { useGlobalDropZone } from '~/composables/useDropZone'
import { getDocCategoryIcon } from '~/utils/docsentry'

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
  // Reset metadata with new fields
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

const handleDrop = (e: DragEvent) => {
  const droppedFile = e.dataTransfer?.files[0]
  if (droppedFile && validateFile(droppedFile)) {
    form.file = droppedFile
  }
}

const handleClose = () => {
  if (loading.value) return
  emit('close')
  // Reset after animation
  setTimeout(() => {
    currentStep.value = 1
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
    emit('success')
    handleClose()
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
