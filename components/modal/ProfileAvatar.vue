<template>
  <UiBaseModal :show="show" title="Photo de profil" @close="$emit('close')">
    <div class="space-y-6">
      <!-- Information Alert -->
      <div class="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
        <div class="shrink-0 p-2 bg-primary/10 rounded-lg h-fit">
          <IconPhoto class="w-5 h-5 text-primary" />
        </div>
        <p class="text-sm text-hsa leading-relaxed">
          Personnalisez votre identité numérique. L'image sera visible par l'administration.
          <span class="block mt-1 font-bold text-[10px] uppercase opacity-60">Formats: JPG, PNG, WebP (Max 2Mo)</span>
        </p>
      </div>

      <!-- Main Interaction Area -->
      <div class="relative group">


        <div class="flex flex-col items-center gap-8 py-4 pointer-events-none">
          <!-- Avatar Preview Circle -->
          <div class="relative w-44 h-44 cursor-pointer pointer-events-auto" @click="triggerFileInput">
            <div
              class="absolute inset-0 bg-gradient-to-tr from-primary via-primary/20 to-secondary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            </div>

            <div
              class="relative z-10 w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-primary to-secondary shadow-2xl">
              <div class="w-full h-full rounded-full overflow-hidden bg-ash border-4 border-WtB shadow-inner">
                <img v-if="multiavatarUrl" :src="multiavatarUrl" alt="Avatar Preview"
                  class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                <div v-else class="w-full h-full flex items-center justify-center bg-ash">
                  <IconPhoto class="w-16 h-16 text-hsa opacity-50" />
                </div>

                <!-- Loading Overlay -->
                <div v-if="isLoading"
                  class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <IconLoader2 class="w-10 h-10 animate-spin text-white" />
                </div>

                <!-- Hover Overlay -->
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-primary/20 transition-all duration-500 flex items-center justify-center rounded-full">
                  <IconCamera
                    class="w-10 h-10 text-WtB opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0" />
                </div>
              </div>
            </div>

            <!-- Delete Badge -->
            <div v-if="currentAvatar && !selectedFile" @click.stop="$emit('delete')"
              class="absolute top-2 right-2 z-30 bg-warning hover:bg-danger text-WtB p-2 rounded-full shadow-lg border-2 border-WtB transition-all hover:scale-110 cursor-pointer group/delete"
              title="Supprimer la photo">
              <IconTrash class="w-4 h-4" />
            </div>

            <!-- Tiny Success Badge -->
            <div v-if="selectedFile"
              class="absolute -top-1 -right-1 z-20 bg-success text-white p-1.5 rounded-full shadow-lg border-2 border-WtB animate-in zoom-in">
              <IconCheck class="w-4 h-4" />
            </div>
          </div>

          <!-- Selection Controls -->
          <div class="w-full space-y-4 pointer-events-auto">
            <UiBaseButton @click="triggerFileInput" variant="ghost"
              class="!w-full !px-6 !py-4 !rounded-2xl !border-2 !border-dashed border-ash hover:!border-primary/10 hover:!bg-primary/5 transition-all duration-300 !flex !items-center !justify-between group/select !h-auto"
              :disabled="isLoading">
              <div class="flex items-center gap-4 text-left">
                <div class="p-3 bg-ash rounded-xl group-hover/select:bg-primary/10 transition-colors">
                  <IconFileUpload class="w-5 h-5 text-hsa group-hover/select:text-primary transition-colors" />
                </div>
                <div>
                  <p class="font-bold text-BtW truncate max-w-[180px]">
                    {{ selectedFile ? selectedFile.name : 'Sélectionner un fichier' }}
                  </p>
                  <p class="text-xs text-hsa">
                    {{ selectedFile ? (selectedFile.size / 1024).toFixed(0) + ' KB' : 'Ou glisser - déposer ici' }}
                  </p>
                </div>
              </div>
              <IconChevronRight class="w-5 h-5 text-hsa opacity-40 group-hover/select:translate-x-1 transition-all" />
            </UiBaseButton>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-6 flex justify-end gap-3">
        <UiBaseButton v-if="currentAvatar && !selectedFile" variant="danger" @click="$emit('delete')"
          :disabled="isLoading">
          <IconTrash class="w-4 h-4" />
        </UiBaseButton>
        <div class="flex-grow"></div>
        <UiBaseButton variant="ghost" @click="$emit('close')" :disabled="isLoading">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" :loading="isLoading" :disabled="!selectedFile" @click="submit">
          Changer la photo
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>

  <!-- File Error Modal -->
  <ModalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage" :file-name="errorFileName"
    :file-type="errorFileType" :file-size="errorFileSize" :accepted-formats="'JPG, PNG, WebP, GIF (Max 2 Mo)'"
    @close="showFileError = false" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import {
  IconPhoto, IconLoader2, IconUpload, IconCamera, IconCheck, IconFileUpload, IconChevronRight, IconTrash
} from '@tabler/icons-vue'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const props = defineProps<{
  show: boolean
  currentAvatar?: string | null
  isLoading: boolean
}>()

const multiavatarUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (props.currentAvatar) {
    if (props.currentAvatar.startsWith('http')) return props.currentAvatar
    const path = props.currentAvatar.replace(/^\/+/, '').replace(/^uploads\//i, '')
    return `/uploads/${path}`
  }
  return null
})

const emit = defineEmits(['close', 'submit', 'delete'])

import { useGlobalDropZone } from '~/composables/useDropZone'
const { enable, disable } = useGlobalDropZone()

const onDroppedFile = (droppedFile: File) => {
  if (props.show && !props.isLoading) {
    processFile(droppedFile)
  }
}

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

watch(() => props.show, (newVal) => {
  if (newVal) {
    enable(onDroppedFile)
  } else {
    disable(onDroppedFile)
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

// Error modal state
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')

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

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  processFile(input.files[0])
}

const processFile = (file: File) => {
  // Validate file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    showError(
      'Format non supporté',
      `Le fichier "${file.name}" n'est pas une image acceptée. Seuls les formats JPG, PNG, WebP et GIF sont autorisés.`,
      file
    )
    return
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    showError(
      'Fichier trop volumineux',
      `Le fichier fait ${(file.size / 1024 / 1024).toFixed(2)} Mo. La taille maximale autorisée est de 2 Mo.`,
      file
    )
    return
  }

  selectedFile.value = file
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

const submit = () => {
  if (selectedFile.value) {
    emit('submit', selectedFile.value)
  }
}
</script>
