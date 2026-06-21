<template>
  <UiBaseModal :show="show" :title="title" maxWidth="lg" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Interactive Viewport -->
      <div
        class="relative w-72 h-72 mx-auto bg-neutral-950 overflow-hidden rounded-2xl border border-ash select-none cursor-move active:cursor-grabbing flex items-center justify-center shadow-inner"
        @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag"
        @touchmove="onDrag" @touchend="stopDrag" @touchcancel="stopDrag" @wheel.prevent="handleWheel">
        <img v-if="previewUrl" ref="cropImage" :src="previewUrl" alt="Aperçu à recadrer"
          class="max-w-none object-contain select-none pointer-events-none transition-transform duration-75 ease-out"
          :style="imageStyle" @load="onImageLoad" />

        <!-- Pure CSS Overlay Mask (Circle or Square cutout of 216px) -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[216px] h-[216px] pointer-events-none border-[999px] border-neutral-950/60 z-10"
          :class="cropShape === 'circle' ? 'rounded-full' : 'rounded-none'"></div>

        <!-- Dashed outline around the crop zone -->
        <div class="absolute w-[216px] h-[216px] pointer-events-none border border-dashed border-white/50 z-20"
          :class="cropShape === 'circle' ? 'rounded-full' : 'rounded-none'"></div>
      </div>

      <!-- Adjustment Tools (Zoom, Rotation, Reset) -->
      <div class="space-y-4">
        <!-- Zoom Slider -->
        <div class="flex items-center gap-3 bg-ash/30 px-4 py-2.5 rounded-2xl">
          <UiBaseButton @click="zoomOut" variant="ghost"
            class="!p-1.5 hover:!bg-primary/10 !rounded-lg hover:!text-primary transition-colors !h-auto !w-auto"
            title="Dézoomer">
            <IconZoomOut class="w-4 h-4" />
          </UiBaseButton>

          <input type="range" min="1" max="4" step="0.01" v-model.number="scale"
            class="flex-1 accent-primary h-1 bg-ashAct/20 rounded-lg appearance-none cursor-pointer" />

          <UiBaseButton @click="zoomIn" variant="ghost"
            class="!p-1.5 hover:!bg-primary/10 !rounded-lg hover:!text-primary transition-colors !h-auto !w-auto"
            title="Zoomer">
            <IconZoomIn class="w-4 h-4" />
          </UiBaseButton>

          <span class="text-[11px] font-code font-bold text-primary min-w-[2.5rem] text-right">
            {{ Math.round(scale * 100) }}%
          </span>
        </div>

        <!-- Tool buttons -->
        <div class="flex justify-center gap-3">
          <UiBaseButton @click="rotate(90)" variant="ghost"
            class="!px-3.5 !py-2 hover:!bg-primary/10 hover:!text-primary transition-colors !rounded-xl !h-auto text-xs font-semibold"
            title="Pivoter de 90° vers la droite">
            <IconRotateClockwise2 class="w-4 h-4 mr-1.5" />
            Pivoter
          </UiBaseButton>

          <UiBaseButton @click="reset" variant="ghost"
            class="!px-3.5 !py-2 hover:!bg-primary/10 hover:!text-primary transition-colors !rounded-xl !h-auto text-xs font-semibold"
            title="Réinitialiser les transformations">
            <IconRefresh class="w-4 h-4 mr-1.5" />
            Réinitialiser
          </UiBaseButton>

          <UiBaseButton @click="$emit('change-file')" variant="ghost"
            class="!px-3.5 !py-2 hover:!bg-primary/10 hover:!text-primary transition-colors !rounded-xl !h-auto text-xs font-semibold"
            title="Sélectionner une autre image">
            <IconCamera class="w-4 h-4 mr-1.5" />
            Autre photo
          </UiBaseButton>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-ash/20">
        <UiBaseButton variant="ghost" @click="$emit('close')" class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" @click="submitCrop"
          class="!rounded-2xl font-black tracking-widest shadow-xl px-10">
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
  cropShape?: 'circle' | 'square'
}>(), {
  cropShape: 'circle'
})

const emit = defineEmits(['close', 'submit', 'change-file'])

const title = computed(() => {
  return props.cropShape === 'circle' ? 'Ajuster la photo de profil' : 'Recadrer l\'image'
})

const previewUrl = ref('')

// Transformations state
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

// Computed image style for live preview transformations
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

// Fit the image naturally inside the crop area (diameter 216px) on load
const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  naturalWidth.value = img.naturalWidth
  naturalHeight.value = img.naturalHeight

  const cropSize = 216
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

// Reactively manage object URLs to prevent memory leaks
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

// Crop canvas rendering and export
const submitCrop = () => {
  if (!props.imageFile || !cropImage.value) return

  const canvas = document.createElement('canvas')
  const canvasSize = 400
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const fileType = props.imageFile.type || 'image/jpeg'
  if (fileType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize, canvasSize)
  }

  const cropSize = 216
  const scaleRatio = canvasSize / cropSize

  // Align canvas transforms with CSS live preview transforms
  ctx.translate(canvasSize / 2, canvasSize / 2)
  ctx.translate(translateX.value * scaleRatio, translateY.value * scaleRatio)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(scale.value * scaleRatio, scale.value * scaleRatio)

  // Draw image centered
  ctx.drawImage(
    cropImage.value,
    -uiImgW.value / 2,
    -uiImgH.value / 2,
    uiImgW.value,
    uiImgH.value
  )

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
