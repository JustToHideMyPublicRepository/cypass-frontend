<template>
  <UiBaseModal :show="show" title="Photo de profil" @close="$emit('close')">
    <div class="space-y-8 py-2">
      <!-- Alerte d'information premium -->
      <div v-if="!cropMode" class="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex gap-4 backdrop-blur-sm">
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
      <div v-if="!cropMode" class="relative group">
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
            <button v-if="currentAvatar && !selectedFile" @click.stop="showDeleteConfirm = true"
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

      <!-- Zone d'édition / Rognage (Crop View) -->
      <div v-else class="space-y-6">
        <!-- Message d'explication -->
        <div class="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3.5 items-center">
          <div class="p-2 bg-primary/10 rounded-xl text-primary">
            <IconPhoto class="w-5 h-5" />
          </div>
          <div class="text-left">
            <p class="text-xs text-hsa font-medium">Ajustez votre photo de profil</p>
            <p class="text-[10px] text-hsa/60">Glissez pour déplacer • Utilisez la molette ou le curseur pour zoomer</p>
          </div>
        </div>

        <!-- Viewport interactif -->
        <div
          class="relative w-72 h-72 mx-auto bg-neutral-950 overflow-hidden rounded-2xl border border-ash select-none cursor-move active:cursor-grabbing flex items-center justify-center shadow-inner"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="stopDrag"
          @touchcancel="stopDrag"
          @wheel.prevent="handleWheel"
        >
          <img
            ref="cropImage"
            :src="previewUrl!"
            alt="Aperçu à recadrer"
            class="max-w-none object-contain select-none pointer-events-none transition-transform duration-75 ease-out"
            :style="imageStyle"
            @load="onImageLoad"
          />

          <!-- Masque d'ombrage circulaire autour du cercle de crop -->
          <div
            class="absolute inset-0 pointer-events-none"
            style="background: radial-gradient(circle, transparent 108px, rgba(15, 23, 42, 0.75) 109px);"
          ></div>

          <!-- Cercle de délimitation de crop -->
          <div
            class="absolute w-[216px] h-[216px] rounded-full border border-dashed border-white/60 pointer-events-none z-10"
          ></div>
        </div>

        <!-- Outils de réglage (Zoom, Rotation, Reset) -->
        <div class="space-y-4">
          <!-- Zoom Slider -->
          <div class="flex items-center gap-3 bg-ash/30 px-4 py-2.5 rounded-2xl">
            <UiBaseButton
              @click="zoomOut"
              variant="ghost"
              class="!p-1.5 hover:!bg-primary/10 !rounded-lg hover:!text-primary transition-colors !h-auto !w-auto"
              title="Dézoomer"
            >
              <IconZoomOut class="w-4 h-4" />
            </UiBaseButton>
            
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              v-model.number="scale"
              class="flex-1 accent-primary h-1 bg-ashAct/20 rounded-lg appearance-none cursor-pointer"
            />

            <UiBaseButton
              @click="zoomIn"
              variant="ghost"
              class="!p-1.5 hover:!bg-primary/10 !rounded-lg hover:!text-primary transition-colors !h-auto !w-auto"
              title="Zoomer"
            >
              <IconZoomIn class="w-4 h-4" />
            </UiBaseButton>
            
            <span class="text-[11px] font-code font-bold text-primary min-w-[2.5rem] text-right">
              {{ Math.round(scale * 100) }}%
            </span>
          </div>

          <!-- Boutons rotation et réinitialisation -->
          <div class="flex justify-center gap-3">
            <UiBaseButton
              @click="rotate(90)"
              variant="ghost"
              class="!px-3.5 !py-2 hover:!bg-primary/10 hover:!text-primary transition-colors !rounded-xl !h-auto text-xs font-semibold"
              title="Pivoter de 90° vers la droite"
            >
              <IconRotateClockwise2 class="w-4 h-4 mr-1.5" />
              Pivoter
            </UiBaseButton>

            <UiBaseButton
              @click="reset"
              variant="ghost"
              class="!px-3.5 !py-2 hover:!bg-primary/10 hover:!text-primary transition-colors !rounded-xl !h-auto text-xs font-semibold"
              title="Réinitialiser les transformations"
            >
              <IconRefresh class="w-4 h-4 mr-1.5" />
              Réinitialiser
            </UiBaseButton>

            <UiBaseButton
              @click="triggerFileInput"
              variant="ghost"
              class="!px-3.5 !py-2 hover:!bg-primary/10 hover:!text-primary transition-colors !rounded-xl !h-auto text-xs font-semibold"
              title="Sélectionner une autre image"
            >
              <IconCamera class="w-4 h-4 mr-1.5" />
              Autre photo
            </UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Actions du bas -->
      <div class="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-ash/20">
        <template v-if="!cropMode">
          <UiBaseButton variant="ghost" @click="$emit('close')" :disabled="isLoading"
            class="!rounded-2xl border-none font-bold">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary" :loading="isLoading" :disabled="!selectedFile" @click="submit"
            class="!rounded-2xl font-black tracking-widest shadow-xl px-10">
            Enregistrer
          </UiBaseButton>
        </template>
        <template v-else>
          <UiBaseButton variant="ghost" @click="cancelCrop" :disabled="isLoading"
            class="!rounded-2xl border-none font-bold">
            Retour
          </UiBaseButton>
          <UiBaseButton variant="primary" :loading="isLoading" @click="submitCrop"
            class="!rounded-2xl font-black tracking-widest shadow-xl px-10">
            Enregistrer
          </UiBaseButton>
        </template>
      </div>
    </div>
  </UiBaseModal>

  <!-- Modale d'erreur de fichier -->
  <ModalGlobalFileError :show="showFileError" :title="fileErrorTitle" :message="fileErrorMessage"
    :file-name="errorFileName" :file-type="errorFileType" :file-size="errorFileSize"
    :accepted-formats="'JPG, PNG, WebP, GIF (Max 2 Mo)'" @close="showFileError = false" />

  <!-- Modale de confirmation de suppression -->
  <UiConfirmModal :show="showDeleteConfirm" title="Supprimer la photo"
    message="Êtes-vous sûr de vouloir supprimer votre photo de profil ?" confirm-text="Supprimer" cancel-text="Annuler"
    variant="danger" :icon="IconTrash" @confirm="confirmDelete" @cancel="showDeleteConfirm = false" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import {
  IconPhoto, IconLoader2, IconCamera, IconCheck, IconFileUpload, IconChevronRight, IconTrash,
  IconZoomIn, IconZoomOut, IconRotateClockwise2, IconRefresh
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

// DOM Elements & reactive states
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Crop, Zoom, and Rotation states
const cropMode = ref(false)
const scale = ref(1)
const rotation = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

const cropImage = ref<HTMLImageElement | null>(null)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const uiImgW = ref(0)
const uiImgH = ref(0)

/**
 * Dynamic CSS styles for the preview image during cropping
 */
const imageStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) rotate(${rotation.value}deg) scale(${scale.value})`,
  width: uiImgW.value ? `${uiImgW.value}px` : 'auto',
  height: uiImgH.value ? `${uiImgH.value}px` : 'auto'
}))

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.1, 4)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.1, 1)
}

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY < 0) zoomIn()
  else zoomOut()
}

const rotate = (deg: number) => {
  rotation.value = (rotation.value + deg) % 360
}

const reset = () => {
  scale.value = 1
  rotation.value = 0
  translateX.value = 0
  translateY.value = 0
}

const getCoordinates = (e: MouseEvent | TouchEvent) => {
  if ('touches' in e && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const mouseEv = e as MouseEvent
  return { x: mouseEv.clientX, y: mouseEv.clientY }
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const coords = getCoordinates(e)
  startX.value = coords.x - translateX.value
  startY.value = coords.y - translateY.value
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const coords = getCoordinates(e)
  translateX.value = coords.x - startX.value
  translateY.value = coords.y - startY.value
}

const stopDrag = () => {
  isDragging.value = false
}

const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  naturalWidth.value = img.naturalWidth
  naturalHeight.value = img.naturalHeight

  const cropSize = 216 // Match the crop circle diameter
  const ratio = img.naturalWidth / img.naturalHeight

  if (ratio > 1) {
    uiImgH.value = cropSize
    uiImgW.value = cropSize * ratio
  } else {
    uiImgW.value = cropSize
    uiImgH.value = cropSize / ratio
  }

  reset()
}

const cancelCrop = () => {
  selectedFile.value = null
  cropMode.value = false
  reset()
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

// Global dropzone management
const onDroppedFile = (droppedFile: File) => {
  if (props.show && !props.isLoading) {
    processFile(droppedFile)
  }
}

// Watch modal show state to toggle DropZone and reset cropping parameters on close
watch(() => props.show, (newVal) => {
  if (newVal) {
    enable(onDroppedFile)
  } else {
    disable(onDroppedFile)
    if (selectedFile.value) selectedFile.value = null
    cropMode.value = false
    reset()
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  disable(onDroppedFile)
})

// Error modal states
const showFileError = ref(false)
const fileErrorTitle = ref('Format non supporté')
const fileErrorMessage = ref('')
const errorFileName = ref('')
const errorFileType = ref('')
const errorFileSize = ref('')

// Delete confirmation modal states
const showDeleteConfirm = ref(false)
const confirmDelete = () => {
  emit('delete')
  showDeleteConfirm.value = false
}

/**
 * Elegantly display file selection errors
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
 * Standard change event handler for file input
 */
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  processFile(input.files[0])
}

/**
 * Image file processing and validation
 */
const processFile = (file: File) => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    showError(
      'Format non supporté',
      `Le fichier "${file.name}" n'est pas une image reconnue. Veuillez utiliser JPG, PNG ou WebP.`,
      file
    )
    return
  }

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
  cropMode.value = true // Switch to crop view
}

/**
 * Crop the image using canvas transformations and submit the resulting file
 */
const submitCrop = async () => {
  if (!selectedFile.value || !cropImage.value) return

  const canvas = document.createElement('canvas')
  const canvasSize = 400
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const fileType = selectedFile.value.type || 'image/jpeg'
  if (fileType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize, canvasSize)
  }

  const cropSize = 216
  const scaleRatio = canvasSize / cropSize

  // Apply transformations in canvas matching CSS transforms
  ctx.translate(canvasSize / 2, canvasSize / 2)
  ctx.translate(translateX.value * scaleRatio, translateY.value * scaleRatio)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(scale.value * scaleRatio, scale.value * scaleRatio)

  // Draw the image centered
  ctx.drawImage(
    cropImage.value,
    -uiImgW.value / 2,
    -uiImgH.value / 2,
    uiImgW.value,
    uiImgH.value
  )

  canvas.toBlob((blob) => {
    if (!blob) return
    const croppedFile = new File([blob], selectedFile.value!.name, {
      type: fileType,
      lastModified: Date.now()
    })
    emit('submit', croppedFile)
  }, fileType, 0.9)
}

/**
 * Standard submit (fallback)
 */
const submit = () => {
  if (selectedFile.value) {
    emit('submit', selectedFile.value)
  }
}
</script>
