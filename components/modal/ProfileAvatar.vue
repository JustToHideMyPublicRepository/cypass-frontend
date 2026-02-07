<template>
  <UiBaseModal :show="show" title="Photo de profil" @close="$emit('close')">
    <div class="space-y-8 py-2">
      <!-- Alerte d'information premium -->
      <div class="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex gap-4 backdrop-blur-sm">
        <div class="shrink-0 p-2.5 bg-primary/10 rounded-xl h-fit text-primary shadow-inner">
          <IconPhoto class="w-6 h-6" />
        </div>
        <div class="space-y-1">
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Personnalisez votre identité numérique. Cette image sera visible sur tous vos produits CYPASS.
          </p>
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Formats: JPG, PNG, WebP • Max 2 Mo
          </p>
        </div>
      </div>

      <!-- Zone d'interaction principale -->
      <div class="relative group">
        <div class="flex flex-col items-center gap-10 py-4 pointer-events-none">
          <!-- Cercle de prévisualisation de l'avatar -->
          <div class="relative w-52 h-52 cursor-pointer pointer-events-auto group/avatar" @click="triggerFileInput">
            <!-- Effet de halo lumineux -->
            <div
              class="absolute inset-0 bg-gradient-to-tr from-primary via-primary/30 to-secondary rounded-full blur-2xl opacity-20 group-hover/avatar:opacity-40 transition-opacity duration-1000">
            </div>

            <!-- Conteneur d'image -->
            <div
              class="relative z-10 w-full h-full rounded-full p-2 bg-gradient-to-tr from-primary/20 to-secondary/20 shadow-2xl backdrop-blur-md group-hover/avatar:from-primary group-hover/avatar:to-secondary transition-all duration-700">
              <div class="w-full h-full rounded-full overflow-hidden bg-ash border-4 border-WtB shadow-inner relative">
                <img v-if="multiavatarUrl" :src="multiavatarUrl" alt="Aperçu Avatar"
                  class="w-full h-full object-cover transition-all duration-1000 group-hover/avatar:scale-110 group-hover/avatar:rotate-2" />
                <div v-else class="w-full h-full flex items-center justify-center bg-ash/50">
                  <IconPhoto class="w-20 h-20 text-hsa opacity-30" />
                </div>

                <!-- Overlay de chargement -->
                <div v-if="isLoading"
                  class="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-20">
                  <IconLoader2 class="w-12 h-12 animate-spin text-white" />
                </div>

                <!-- Overlay au survol -->
                <div
                  class="absolute inset-0 bg-black/0 group-hover/avatar:bg-primary/30 transition-all duration-500 flex items-center justify-center rounded-full z-10">
                  <div
                    class="bg-WtB/20 backdrop-blur-md p-4 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 translate-y-4 group-hover/avatar:translate-y-0 shadow-xl border border-WtB/30">
                    <IconCamera class="w-10 h-10 text-WtB" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Badge de suppression -->
            <button v-if="currentAvatar && !selectedFile" @click.stop="$emit('delete')"
              class="absolute top-4 right-4 z-30 bg-white hover:bg-danger text-danger hover:text-white p-2.5 rounded-full shadow-2xl border border-ash transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Supprimer la photo actuelle">
              <IconTrash class="w-5 h-5" />
            </button>

            <!-- Badge de succès (si fichier sélectionné) -->
            <div v-if="selectedFile"
              class="absolute -top-2 -right-2 z-20 bg-success text-white p-2 rounded-full shadow-2xl border-2 border-WtB animate-in zoom-in duration-500 ring-4 ring-success/20">
              <IconCheck class="w-5 h-5" />
            </div>
          </div>

          <!-- Contrôles de sélection -->
          <div class="w-full space-y-4 pointer-events-auto">
            <UiBaseButton @click="triggerFileInput" variant="ghost"
              class="!w-full !px-8 !py-6 !rounded-[1.5rem] !border-2 !border-dashed border-ashAct/30 hover:!border-primary/40 hover:!bg-primary/5 transition-all duration-500 !flex !items-center !justify-between group/select !h-auto border-ash shadow-sm"
              :disabled="isLoading">
              <div class="flex items-center gap-5 text-left">
                <div
                  class="p-4 bg-ashAct/10 rounded-2xl group-hover/select:bg-primary/10 transition-colors shadow-inner">
                  <IconFileUpload
                    class="w-6 h-6 text-hsa group-hover/select:text-primary transition-all duration-500" />
                </div>
                <div>
                  <p class="font-black text-BtW truncate max-w-[200px] uppercase tracking-tight">
                    {{ selectedFile ? selectedFile.name : 'Sélectionner une photo' }}
                  </p>
                  <p class="text-[10px] text-hsa font-bold uppercase tracking-widest opacity-60">
                    {{ selectedFile ?
                      (selectedFile.size / 1024).toFixed(0) + ' KB' : 'Cliquez pour parcourir vos fichiers' }} </p>
                </div>
              </div>
              <IconChevronRight
                class="w-6 h-6 text-hsa opacity-30 group-hover/select:translate-x-2 transition-all duration-500" />
            </UiBaseButton>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
          </div>
        </div>
      </div>

      <!-- Actions du bas -->
      <div class="pt-6 flex flex-col sm:flex-row justify-end gap-3">
        <UiBaseButton variant="ghost" @click="$emit('close')" :disabled="isLoading"
          class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" :loading="isLoading" :disabled="!selectedFile" @click="submit"
          class="!rounded-2xl font-black tracking-widest shadow-xl px-10">
          Enregistrer
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage" :file-name="errorFileName"
    :file-type="errorFileType" :file-size="errorFileSize" :accepted-formats="'JPG, PNG, WebP, GIF (Max 2 Mo)'"
    @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import {
  IconPhoto, IconLoader2, IconUpload, IconCamera, IconCheck, IconFileUpload, IconChevronRight, IconTrash
} from '@tabler/icons-vue'
import { useGlobalDropZone } from '~/composables/useDropZone'

// Configuration des fichiers
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 Mo

// Propriétés de la modale ProfileAvatar
const props = defineProps<{
  show: boolean
  currentAvatar?: string | null
  isLoading: boolean
}>()

const emit = defineEmits(['close', 'submit', 'delete'])

// Calcul de l'URL d'aperçu de l'image
const multiavatarUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (props.currentAvatar) {
    if (props.currentAvatar.startsWith('http')) return props.currentAvatar
    const path = props.currentAvatar.replace(/^\/+/, '').replace(/^uploads\//i, '')
    return `/uploads/${path}`
  }
  return null
})

const { enable, disable } = useGlobalDropZone()

// Eléments DOM et états réactifs
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Gestion du DropZone global
const onDroppedFile = (droppedFile: File) => {
  if (props.show && !props.isLoading) {
    processFile(droppedFile)
  }
}

// Surveillance de la visibilité pour activation du DropZone
watch(() => props.show, (newVal) => {
  if (newVal) {
    enable(onDroppedFile)
  } else {
    disable(onDroppedFile)
    // Réinitialisation lors de la fermeture
    if (selectedFile.value) selectedFile.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  disable(onDroppedFile)
})

// États pour la modale d'erreur personnalisée
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')

/**
 * Affiche l'erreur de fichier de manière élégante
 */
const showError = (title: string, message: string, file: File) => {
  fileErrorTitle.value = title
  fileErrorMessage.value = message
  errorFileName.value = file.name
  errorFileType.value = file.name.split('.').pop()?.toUpperCase() || 'Inconnu'
  errorFileSize.value = (file.size / 1024 / 1024).toFixed(2) + ' Mo'
  showFileError.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

/**
 * Intercepteur standard pour l'input file
 */
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  processFile(input.files[0])
}

/**
 * Traitement et validation de l'image
 */
const processFile = (file: File) => {
  // Validation du type MIME
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    showError(
      'Format non supporté',
      `Le fichier "${file.name}" n'est pas une image reconnue. Veuillez utiliser JPG, PNG ou WebP.`,
      file
    )
    return
  }

  // Validation de la taille (2 Mo max)
  if (file.size > MAX_FILE_SIZE) {
    showError(
      'Image trop lourde',
      `Votre image fait ${(file.size / 1024 / 1024).toFixed(2)} Mo. Elle ne doit pas dépasser 2 Mo pour être acceptée.`,
      file
    )
    return
  }

  selectedFile.value = file
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

/**
 * Émet l'événement de soumission avec le fichier
 */
const submit = () => {
  if (selectedFile.value) {
    emit('submit', selectedFile.value)
  }
}
</script>
