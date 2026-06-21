<template>
  <UiBaseModal :show="show" :title="title" maxWidth="lg" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Interactive Viewport -->
      <div
        class="relative mx-auto bg-neutral-950 overflow-hidden rounded-2xl border border-ash select-none flex items-center justify-center shadow-inner"
        :style="containerStyle"
        @mousemove="onGlobalMove"
        @mouseup="onGlobalEnd"
        @mouseleave="onGlobalEnd"
        @touchmove="onGlobalMove"
        @touchend="onGlobalEnd"
        @touchcancel="onGlobalEnd"
      >
        <!-- Interactive Image Drag Area for Fixed Modes -->
        <div
          v-if="cropShape !== 'manual'"
          class="absolute inset-0 cursor-move active:cursor-grabbing flex items-center justify-center"
          @mousedown="startDrag"
          @touchstart="startDrag"
          @wheel.prevent="handleWheel"
        >
          <img
            v-if="previewUrl"
            ref="cropImage"
            :src="previewUrl"
            alt="Aperçu à recadrer"
            class="max-w-none object-contain select-none pointer-events-none transition-transform duration-75 ease-out"
            :style="imageStyle"
            @load="onImageLoad"
          />
        </div>

        <!-- Static Image Area for Manual Mode -->
        <img
          v-else-if="previewUrl"
          ref="cropImage"
          :src="previewUrl"
          alt="Aperçu à recadrer"
          class="object-contain select-none pointer-events-none"
          :style="{
            transform: `rotate(${rotation}deg)`,
            width: (rotation === 90 || rotation === 270) ? `${containerH}px` : `${containerW}px`,
            height: (rotation === 90 || rotation === 270) ? `${containerW}px` : `${containerH}px`
          }"
          @load="onImageLoad"
        />

        <!-- Pure CSS Overlay Mask for Fixed Modes (Circle, Square, Rectangle) -->
        <div
          v-if="cropShape !== 'manual'"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-[999px] border-neutral-950/60 z-10"
          :class="{
            'rounded-full': cropShape === 'circle',
            'rounded-none': cropShape === 'square' || cropShape === 'rectangle'
          }"
          :style="{
            width: `${cropW}px`,
            height: `${cropH}px`
          }"
        ></div>

        <!-- Dashed crop boundaries for Fixed Modes -->
        <div
          v-if="cropShape !== 'manual'"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border border-dashed border-white/50 z-20"
          :class="{
            'rounded-full': cropShape === 'circle',
            'rounded-none': cropShape === 'square' || cropShape === 'rectangle'
          }"
          :style="{
            width: `${cropW}px`,
            height: `${cropH}px`
          }"
        ></div>

        <!-- Interactive Resizable/Draggable Crop Box for Manual Mode -->
        <div v-if="cropShape === 'manual'" class="absolute inset-0 z-20 pointer-events-none">
          <!-- Crop Selection Box -->
          <div
            class="absolute border-2 border-primary bg-black/10 pointer-events-auto cursor-move"
            :style="{
              left: `${boxX}px`,
              top: `${boxY}px`,
              width: `${boxW}px`,
              height: `${boxH}px`,
              touchAction: 'none'
            }"
            @mousedown="onHandleStart($event, 'move')"
            @touchstart="onHandleStart($event, 'move')"
          >
            <!-- 4 Corner Handles -->
            <div
              class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary rounded-full cursor-nwse-resize border border-white"
              style="touch-action: none;"
              @mousedown="onHandleStart($event, 'nw')"
              @touchstart="onHandleStart($event, 'nw')"
            ></div>
            <div
              class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary rounded-full cursor-nesw-resize border border-white"
              style="touch-action: none;"
              @mousedown="onHandleStart($event, 'ne')"
              @touchstart="onHandleStart($event, 'ne')"
            ></div>
            <div
              class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary rounded-full cursor-nesw-resize border border-white"
              style="touch-action: none;"
              @mousedown="onHandleStart($event, 'sw')"
              @touchstart="onHandleStart($event, 'sw')"
            ></div>
            <div
              class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-full cursor-nwse-resize border border-white"
              style="touch-action: none;"
              @mousedown="onHandleStart($event, 'se')"
              @touchstart="onHandleStart($event, 'se')"
            ></div>
          </div>

          <!-- Dimmed mask overlays surrounding the crop selection box -->
          <div class="absolute bg-black/60 left-0 top-0 right-0" :style="{ height: `${boxY}px` }"></div>
          <div class="absolute bg-black/60 left-0 bottom-0 right-0" :style="{ top: `${boxY + boxH}px` }"></div>
          <div class="absolute bg-black/60 left-0 animate-fade-in" :style="{ top: `${boxY}px`, height: `${boxH}px`, width: `${boxX}px` }"></div>
          <div class="absolute bg-black/60 right-0 animate-fade-in" :style="{ top: `${boxY}px`, height: `${boxH}px`, left: `${boxX + boxW}px` }"></div>
        </div>
      </div>

      <!-- Adjustment Tools (Zoom, Rotation, Reset) -->
      <div class="space-y-4">
        <!-- Zoom Slider (Hidden in Manual Mode) -->
        <div v-if="cropShape !== 'manual'" class="flex items-center gap-3 bg-ash/30 px-4 py-2.5 rounded-2xl">
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

        <!-- Tool buttons -->
        <div class="flex justify-center gap-3">
          <UiBaseButton @click="rotate(90)" variant="ghost" class="!px-3.5 !py-2 !rounded-xl !h-auto text-xs"
            title="Pivoter de 90° vers la droite">
            <IconRotateClockwise2 class="w-4 h-4 mr-1.5" />
            Pivoter
          </UiBaseButton>

          <UiBaseButton @click="reset" variant="ghost" class="!px-3.5 !py-2 !rounded-xl !h-auto text-xs"
            title="Réinitialiser les transformations">
            <IconRefresh class="w-4 h-4 mr-1.5" />
            Réinitialiser
          </UiBaseButton>

          <UiBaseButton @click="$emit('change-file')" variant="accent" class="!px-3.5 !py-2 !rounded-xl !h-auto text-xs"
            title="Sélectionner une autre image">
            <IconCamera class="w-4 h-4 mr-1.5" />
            Autre photo
          </UiBaseButton>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-2 flex flex-col sm:flex-row justify-end gap-3 border-t border-ash/20">
        <UiBaseButton variant="ghost" @click="$emit('close')" class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" @click="submitCrop" class="!rounded-2xl font-black tracking-widest shadow-xl px-10">
          Enregistrer
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { IconCamera, IconZoomIn, IconZoomOut, IconRotateClockwise2, IconRefresh } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  show: boolean
  imageFile: File | null
  cropShape?: 'circle' | 'square' | 'rectangle' | 'manual'
}>(), {
  cropShape: 'circle'
})

const emit = defineEmits(['close', 'submit', 'change-file'])

const title = computed(() => {
  if (props.cropShape === 'circle') return 'Ajuster la photo de profil'
  if (props.cropShape === 'manual') return 'Recadrer manuellement l\'image'
  return 'Recadrer l\'image'
})

const previewUrl = ref('')

// Transformations & dragging state
const scale = ref(1)
const rotation = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

// Image specifications
const cropImage = ref<HTMLImageElement | null>(null)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const uiImgW = ref(0)
const uiImgH = ref(0)

// Container sizing (especially dynamic for manual cropping)
const containerW = ref(384)
const containerH = ref(384)

// Manual crop box specifications
const boxX = ref(0)
const boxY = ref(0)
const boxW = ref(0)
const boxH = ref(0)

const dragMode = ref<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null)
const dragStartBox = ref({ x: 0, y: 0, w: 0, h: 0 })
const dragStartPointer = ref({ x: 0, y: 0 })

// Cutout dimensions for fixed cropping shape
const cropW = computed(() => {
  if (props.cropShape === 'rectangle') return 320
  return 250
})

const cropH = computed(() => {
  if (props.cropShape === 'rectangle') return 180
  return 250
})

// Container dimensions style
const containerStyle = computed(() => {
  if (props.cropShape === 'manual') {
    return {
      width: `${containerW.value}px`,
      height: `${containerH.value}px`
    }
  }
  return {
    width: '100%',
    maxWidth: '384px',
    height: '384px'
  }
})

// Dynamic style for the preview image in fixed modes
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
  if (props.cropShape === 'manual') {
    computeContainerDimensions()
  }
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

// Global Move Handler (delegates between Manual selection and Fixed zoom dragging)
const onGlobalMove = (e: MouseEvent | TouchEvent) => {
  const pointer = getCoordinates(e)

  if (props.cropShape === 'manual') {
    if (!dragMode.value) return
    const dx = pointer.x - dragStartPointer.value.x
    const dy = pointer.y - dragStartPointer.value.y

    if (dragMode.value === 'move') {
      let newX = dragStartBox.value.x + dx
      let newY = dragStartBox.value.y + dy

      newX = Math.max(0, Math.min(newX, containerW.value - boxW.value))
      newY = Math.max(0, Math.min(newY, containerH.value - boxH.value))

      boxX.value = newX
      boxY.value = newY
    } else {
      const minSize = 45
      const currentBoxX = dragStartBox.value.x
      const currentBoxY = dragStartBox.value.y
      const currentBoxW = dragStartBox.value.w
      const currentBoxH = dragStartBox.value.h

      if (dragMode.value === 'nw') {
        const x2 = currentBoxX + currentBoxW
        const y2 = currentBoxY + currentBoxH
        let desiredX = currentBoxX + dx
        let desiredY = currentBoxY + dy

        desiredX = Math.max(0, Math.min(desiredX, x2 - minSize))
        desiredY = Math.max(0, Math.min(desiredY, y2 - minSize))

        boxX.value = desiredX
        boxY.value = desiredY
        boxW.value = x2 - desiredX
        boxH.value = y2 - desiredY
      } else if (dragMode.value === 'ne') {
        const y2 = currentBoxY + currentBoxH
        let desiredY = currentBoxY + dy
        desiredY = Math.max(0, Math.min(desiredY, y2 - minSize))

        let desiredW = currentBoxW + dx
        desiredW = Math.max(minSize, Math.min(desiredW, containerW.value - currentBoxX))

        boxY.value = desiredY
        boxH.value = y2 - desiredY
        boxW.value = desiredW
      } else if (dragMode.value === 'sw') {
        const x2 = currentBoxX + currentBoxW
        let desiredX = currentBoxX + dx
        desiredX = Math.max(0, Math.min(desiredX, x2 - minSize))

        let desiredH = currentBoxH + dy
        desiredH = Math.max(minSize, Math.min(desiredH, containerH.value - currentBoxY))

        boxX.value = desiredX
        boxW.value = x2 - desiredX
        boxH.value = desiredH
      } else if (dragMode.value === 'se') {
        let desiredW = currentBoxW + dx
        let desiredH = currentBoxH + dy

        desiredW = Math.max(minSize, Math.min(desiredW, containerW.value - currentBoxX))
        desiredH = Math.max(minSize, Math.min(desiredH, containerH.value - currentBoxY))

        boxW.value = desiredW
        boxH.value = desiredH
      }
    }
  } else {
    if (!isDragging.value) return
    translateX.value = pointer.x - startX.value
    translateY.value = pointer.y - startY.value
  }
}

const onGlobalEnd = () => {
  if (props.cropShape === 'manual') {
    dragMode.value = null
  } else {
    isDragging.value = false
  }
}

const onHandleStart = (e: MouseEvent | TouchEvent, mode: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
  e.stopPropagation()
  e.preventDefault()
  dragMode.value = mode
  const pointer = getCoordinates(e)
  dragStartPointer.value = { x: pointer.x, y: pointer.y }
  dragStartBox.value = { x: boxX.value, y: boxY.value, w: boxW.value, h: boxH.value }
}

// Compute container dimensions dynamically to fit image ratio in manual cropping
const computeContainerDimensions = () => {
  const isSwapped = rotation.value === 90 || rotation.value === 270
  const w = isSwapped ? naturalHeight.value : naturalWidth.value
  const h = isSwapped ? naturalWidth.value : naturalHeight.value

  const ratio = w / h
  const maxSize = 384

  if (ratio > 1) {
    containerW.value = maxSize
    containerH.value = Math.round(maxSize / ratio)
  } else {
    containerH.value = maxSize
    containerW.value = Math.round(maxSize * ratio)
  }

  boxX.value = Math.round(containerW.value * 0.1)
  boxY.value = Math.round(containerH.value * 0.1)
  boxW.value = Math.round(containerW.value * 0.8)
  boxH.value = Math.round(containerH.value * 0.8)
}

const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  naturalWidth.value = img.naturalWidth
  naturalHeight.value = img.naturalHeight

  if (props.cropShape === 'manual') {
    computeContainerDimensions()
  } else {
    const ratio = img.naturalWidth / img.naturalHeight
    const targetRatio = cropW.value / cropH.value

    if (ratio > targetRatio) {
      uiImgH.value = cropH.value
      uiImgW.value = cropH.value * ratio
    } else {
      uiImgW.value = cropW.value
      uiImgH.value = cropW.value / ratio
    }

    containerW.value = 384
    containerH.value = 384
    reset()
  }
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    reset()
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
  } else if (props.imageFile) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(props.imageFile)
  }
}, { immediate: true })

watch(() => props.imageFile, (newFile) => {
  if (props.show && newFile) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(newFile)
  }
})

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

const submitCrop = () => {
  if (!props.imageFile || !cropImage.value) return

  const fileType = props.imageFile.type || 'image/jpeg'
  const canvas = document.createElement('canvas')

  if (props.cropShape === 'manual') {
    const isSwapped = rotation.value === 90 || rotation.value === 270
    const naturalW = isSwapped ? naturalHeight.value : naturalWidth.value
    const naturalH = isSwapped ? naturalWidth.value : naturalHeight.value
    const scaleFactor = naturalW / containerW.value

    const canvasA = document.createElement('canvas')
    canvasA.width = naturalW
    canvasA.height = naturalH
    const ctxA = canvasA.getContext('2d')
    if (!ctxA) return

    if (fileType === 'image/jpeg') {
      ctxA.fillStyle = '#ffffff'
      ctxA.fillRect(0, 0, naturalW, naturalH)
    }

    ctxA.translate(naturalW / 2, naturalH / 2)
    ctxA.rotate((rotation.value * Math.PI) / 180)
    ctxA.drawImage(
      cropImage.value,
      -naturalWidth.value / 2,
      -naturalHeight.value / 2,
      naturalWidth.value,
      naturalHeight.value
    )

    const finalW = Math.round(boxW.value * scaleFactor)
    const finalH = Math.round(boxH.value * scaleFactor)

    canvas.width = finalW
    canvas.height = finalH
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      canvasA,
      Math.round(boxX.value * scaleFactor),
      Math.round(boxY.value * scaleFactor),
      finalW,
      finalH,
      0,
      0,
      finalW,
      finalH
    )
  } else {
    const canvasW = props.cropShape === 'rectangle' ? 480 : 400
    const canvasH = props.cropShape === 'rectangle' ? 270 : 400
    canvas.width = canvasW
    canvas.height = canvasH
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (fileType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasW, canvasH)
    }

    const scaleRatio = canvasW / cropW.value

    ctx.translate(canvasW / 2, canvasH / 2)
    ctx.translate(translateX.value * scaleRatio, translateY.value * scaleRatio)
    ctx.rotate((rotation.value * Math.PI) / 180)
    ctx.scale(scale.value * scaleRatio, scale.value * scaleRatio)

    ctx.drawImage(
      cropImage.value,
      -uiImgW.value / 2,
      -uiImgH.value / 2,
      uiImgW.value,
      uiImgH.value
    )
  }

  canvas.toBlob((blob) => {
    if (!blob) return
    const croppedFile = new File([blob], props.imageFile!.name, {
      type: fileType,
      lastModified: Date.now()
    })
    emit('submit', croppedFile)
  }, fileType, 0.9)
}
</script>
