<template>
  <UiBaseModal :show="show" :title="title" maxWidth="lg" @close="$emit('close')">
    <div class="space-y-4 py-2">

      <!-- Interactive Viewport -->
      <div ref="viewportEl"
        class="relative mx-auto bg-neutral-950 overflow-hidden rounded-2xl border border-ash/50 shadow-inner select-none"
        :style="{ width: `${containerSize}px`, height: `${containerSize}px` }" @mousemove="onMove" @mouseup="onEnd"
        @mouseleave="onEnd" @touchmove.prevent="onMove" @touchend="onEnd" @touchcancel="onEnd">
        <!-- The Image: static, fills the container, object-contain -->
        <img v-if="previewUrl" ref="cropImage" :src="previewUrl" alt="Image à recadrer"
          class="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          :style="{ transform: `rotate(${rotation}deg)` }" @load="onImageLoad" />

        <!-- Dimmed mask: 4 semi-transparent rects surrounding the crop box -->
        <template v-if="imageLoaded">
          <!-- top -->
          <div class="absolute left-0 right-0 top-0 bg-black/60 pointer-events-none"
            :style="{ height: `${cropBoxY}px` }"></div>
          <!-- bottom -->
          <div class="absolute left-0 right-0 bg-black/60 pointer-events-none"
            :style="{ top: `${cropBoxY + cropBoxH}px`, bottom: 0 }"></div>
          <!-- left -->
          <div class="absolute bg-black/60 pointer-events-none"
            :style="{ top: `${cropBoxY}px`, height: `${cropBoxH}px`, left: 0, width: `${cropBoxX}px` }"></div>
          <!-- right -->
          <div class="absolute bg-black/60 pointer-events-none"
            :style="{ top: `${cropBoxY}px`, height: `${cropBoxH}px`, left: `${cropBoxX + cropBoxW}px`, right: 0 }">
          </div>
        </template>

        <!-- Crop Zone Overlay -->
        <div v-if="imageLoaded" class="absolute border-2 border-primary shadow-lg cursor-move"
          :class="cropShape === 'circle' ? 'rounded-full' : 'rounded-sm'" :style="{
            left: `${cropBoxX}px`,
            top: `${cropBoxY}px`,
            width: `${cropBoxW}px`,
            height: `${cropBoxH}px`,
            touchAction: 'none',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.25) inset'
          }" @mousedown="onCropStart($event, 'move')" @touchstart="onCropStart($event, 'move')"
          @wheel.prevent="onCropWheel">
          <!-- Rule-of-thirds grid lines -->
          <div class="absolute inset-0 pointer-events-none opacity-40">
            <div class="absolute left-1/3 top-0 bottom-0 border-l border-white/30"></div>
            <div class="absolute right-1/3 top-0 bottom-0 border-l border-white/30"></div>
            <div class="absolute top-1/3 left-0 right-0 border-t border-white/30"></div>
            <div class="absolute bottom-1/3 left-0 right-0 border-t border-white/30"></div>
          </div>

          <!-- Corner handles (shown only for non-circle or for manual) -->
          <template v-if="cropShape !== 'circle'">
            <div v-for="handle in handles" :key="handle.dir"
              class="absolute w-4 h-4 bg-primary border-2 border-white rounded-sm z-10 hover:scale-110 transition-transform"
              :class="handle.cursor" :style="handle.style" @mousedown.stop="onCropStart($event, handle.dir)"
              @touchstart.stop="onCropStart($event, handle.dir)"></div>
          </template>

          <!-- For circle: single bottom-right scale handle -->
          <div v-else
            class="absolute -bottom-2 -right-2 w-5 h-5 bg-primary border-2 border-white rounded-full z-10 cursor-nwse-resize"
            @mousedown.stop="onCropStart($event, 'se')" @touchstart.stop="onCropStart($event, 'se')"></div>
        </div>

        <!-- Loading spinner -->
        <div v-if="!imageLoaded && previewUrl" class="absolute inset-0 flex items-center justify-center">
          <IconLoader2 class="w-8 h-8 animate-spin text-primary" />
        </div>

        <!-- Hint top-right -->
        <div v-if="imageLoaded" class="absolute top-2 right-2 pointer-events-none z-20">
          <span
            class="text-[9px] text-white/50 font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
            {{ cropShape !== 'circle' ? 'Molette = zoom' : 'Glisser = déplacer' }}
          </span>
        </div>
      </div>

      <!-- Adjustment Tools -->
      <div class="space-y-3">
        <!-- Crop size slider (hidden in manual mode) -->
        <div v-if="cropShape !== 'manual'" class="flex items-center gap-3 bg-ash/30 px-4 py-2.5 rounded-2xl">
          <button class="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            title="Réduire le cadre" @click="resizeCrop(-20)">
            <IconZoomOut class="w-4 h-4" />
          </button>

          <input type="range" :min="minCropSize" :max="maxCropSize" step="1" :value="cropBoxW"
            class="flex-1 accent-primary h-1 rounded-lg appearance-none cursor-pointer" @input="onSliderInput" />

          <button class="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            title="Agrandir le cadre" @click="resizeCrop(20)">
            <IconZoomIn class="w-4 h-4" />
          </button>

          <span class="text-[11px] font-code font-bold text-primary min-w-[2.5rem] text-right">
            {{ Math.round((cropBoxW / maxCropSize) * 100) }}%
          </span>
        </div>

        <!-- Tool buttons -->
        <div class="flex justify-center gap-3">
          <UiBaseButton @click="rotate(90)" variant="ghost" class="!px-3.5 !py-2 !rounded-xl !h-auto text-xs"
            title="Pivoter de 90°">
            <IconRotateClockwise2 class="w-4 h-4 mr-1.5" />
            Pivoter
          </UiBaseButton>

          <UiBaseButton @click="resetCrop" variant="ghost" class="!px-3.5 !py-2 !rounded-xl !h-auto text-xs"
            title="Réinitialiser">
            <IconRefresh class="w-4 h-4 mr-1.5" />
            Réinitialiser
          </UiBaseButton>

          <UiBaseButton @click="$emit('change-file')" variant="accent" class="!px-3.5 !py-2 !rounded-xl !h-auto text-xs"
            title="Changer de photo">
            <IconCamera class="w-4 h-4 mr-1.5" />
            Autre photo
          </UiBaseButton>
        </div>
      </div>

      <!-- Footer -->
      <div class="pt-2 flex flex-col sm:flex-row justify-end gap-3 border-t border-ash/20">
        <UiBaseButton variant="ghost" @click="$emit('close')" class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" @click="submitCrop"
          class="!rounded-2xl font-black tracking-widest shadow-xl px-10" :disabled="!imageLoaded">
          Enregistrer
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { IconCamera, IconZoomIn, IconZoomOut, IconRotateClockwise2, IconRefresh, IconLoader2 } from '@tabler/icons-vue'

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
  if (props.cropShape === 'manual') return 'Recadrer manuellement'
  if (props.cropShape === 'rectangle') return 'Recadrer (16:9)'
  return 'Recadrer l\'image'
})

// ─── Container & Image State ────────────────────────────────────────────────
const containerSize = 384
const previewUrl = ref('')
const cropImage = ref<HTMLImageElement | null>(null)
const viewportEl = ref<HTMLElement | null>(null)
const imageLoaded = ref(false)
const rotation = ref(0)

// Natural image dimensions
const naturalW = ref(0)
const naturalH = ref(0)

// Rendered image bounds within the container (accounting for object-contain letterboxing)
const imgRenderW = ref(0)
const imgRenderH = ref(0)
const imgOffsetX = ref(0)
const imgOffsetY = ref(0)

// ─── Crop Box State ─────────────────────────────────────────────────────────
const cropBoxX = ref(0)
const cropBoxY = ref(0)
const cropBoxW = ref(0)
const cropBoxH = ref(0)

// ─── Drag State ─────────────────────────────────────────────────────────────
type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | null
const dragMode = ref<DragMode>(null)
const dragStartPointer = ref({ x: 0, y: 0 })
const dragStartBox = ref({ x: 0, y: 0, w: 0, h: 0 })

// ─── Crop Size Constraints ───────────────────────────────────────────────────
const minCropSize = computed(() => Math.min(imgRenderW.value, imgRenderH.value) * 0.2)
const maxCropSize = computed(() => {
  if (props.cropShape === 'rectangle') {
    return Math.min(imgRenderW.value, imgRenderH.value / (9 / 16))
  }
  return Math.min(imgRenderW.value, imgRenderH.value)
})

// ─── Corner Handles ──────────────────────────────────────────────────────────
const handles = computed(() => [
  { dir: 'nw' as const, cursor: 'cursor-nwse-resize', style: 'top: -8px; left: -8px;' },
  { dir: 'ne' as const, cursor: 'cursor-nesw-resize', style: 'top: -8px; right: -8px;' },
  { dir: 'sw' as const, cursor: 'cursor-nesw-resize', style: 'bottom: -8px; left: -8px;' },
  { dir: 'se' as const, cursor: 'cursor-nwse-resize', style: 'bottom: -8px; right: -8px;' },
])

// ─── Compute image rendered area within container ────────────────────────────
const computeImageBounds = () => {
  const isSwapped = rotation.value === 90 || rotation.value === 270
  const srcW = isSwapped ? naturalH.value : naturalW.value
  const srcH = isSwapped ? naturalW.value : naturalH.value

  const ratio = srcW / srcH
  if (ratio > 1) {
    imgRenderW.value = containerSize
    imgRenderH.value = containerSize / ratio
  } else {
    imgRenderH.value = containerSize
    imgRenderW.value = containerSize * ratio
  }
  imgOffsetX.value = (containerSize - imgRenderW.value) / 2
  imgOffsetY.value = (containerSize - imgRenderH.value) / 2
}

// ─── Initialize crop box (centered, 75% of image render area) ───────────────
const initCropBox = () => {
  const initSize = Math.round(Math.min(imgRenderW.value, imgRenderH.value) * 0.75)

  if (props.cropShape === 'rectangle') {
    cropBoxW.value = Math.min(imgRenderW.value, initSize)
    cropBoxH.value = Math.round(cropBoxW.value * (9 / 16))
  } else if (props.cropShape === 'manual') {
    cropBoxW.value = Math.round(imgRenderW.value * 0.75)
    cropBoxH.value = Math.round(imgRenderH.value * 0.75)
  } else {
    cropBoxW.value = initSize
    cropBoxH.value = initSize
  }

  cropBoxX.value = imgOffsetX.value + (imgRenderW.value - cropBoxW.value) / 2
  cropBoxY.value = imgOffsetY.value + (imgRenderH.value - cropBoxH.value) / 2
}

const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  naturalW.value = img.naturalWidth
  naturalH.value = img.naturalHeight
  imageLoaded.value = true
  computeImageBounds()
  initCropBox()
}

// ─── Rotation ────────────────────────────────────────────────────────────────
const rotate = (deg: number) => {
  rotation.value = (rotation.value + deg) % 360
  computeImageBounds()
  initCropBox()
}

// ─── Reset ───────────────────────────────────────────────────────────────────
const resetCrop = () => {
  rotation.value = 0
  computeImageBounds()
  initCropBox()
}

// ─── Resize crop box (keep centered, constrained within image) ───────────────
const resizeCrop = (delta: number) => {
  const isRect = props.cropShape === 'rectangle'
  const isFixed = props.cropShape === 'circle' || props.cropShape === 'square' || isRect
  const aspectRatio = isRect ? (16 / 9) : 1

  if (isFixed) {
    const maxW = Math.min(maxCropSize.value, imgRenderW.value, imgRenderH.value * aspectRatio)
    const newW = Math.max(minCropSize.value, Math.min(cropBoxW.value + delta, maxW))
    const newH = newW / aspectRatio

    const cx = cropBoxX.value + cropBoxW.value / 2
    const cy = cropBoxY.value + cropBoxH.value / 2

    cropBoxW.value = Math.round(newW)
    cropBoxH.value = Math.round(newH)
    cropBoxX.value = Math.round(Math.max(imgOffsetX.value, Math.min(cx - newW / 2, imgOffsetX.value + imgRenderW.value - newW)))
    cropBoxY.value = Math.round(Math.max(imgOffsetY.value, Math.min(cy - newH / 2, imgOffsetY.value + imgRenderH.value - newH)))
  } else {
    const newW = Math.max(minCropSize.value, Math.min(cropBoxW.value + delta, imgRenderW.value))
    const newH = Math.max(minCropSize.value, Math.min(cropBoxH.value + (delta * (cropBoxH.value / cropBoxW.value)), imgRenderH.value))

    const cx = cropBoxX.value + cropBoxW.value / 2
    const cy = cropBoxY.value + cropBoxH.value / 2

    cropBoxW.value = Math.round(newW)
    cropBoxH.value = Math.round(newH)
    cropBoxX.value = Math.round(Math.max(imgOffsetX.value, Math.min(cx - newW / 2, imgOffsetX.value + imgRenderW.value - newW)))
    cropBoxY.value = Math.round(Math.max(imgOffsetY.value, Math.min(cy - newH / 2, imgOffsetY.value + imgRenderH.value - newH)))
  }
}

const onCropWheel = (e: WheelEvent) => {
  resizeCrop(e.deltaY < 0 ? 15 : -15)
}

const onSliderInput = (e: Event) => {
  const val = parseInt((e.target as HTMLInputElement).value, 10)
  const delta = val - cropBoxW.value
  resizeCrop(delta)
}

// ─── Pointer helpers ─────────────────────────────────────────────────────────
const getPointer = (e: MouseEvent | TouchEvent) => {
  if ('touches' in e && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
}

// ─── Drag start ──────────────────────────────────────────────────────────────
const onCropStart = (e: MouseEvent | TouchEvent, mode: NonNullable<DragMode>) => {
  e.preventDefault()
  dragMode.value = mode
  const p = getPointer(e)
  dragStartPointer.value = { x: p.x, y: p.y }
  dragStartBox.value = { x: cropBoxX.value, y: cropBoxY.value, w: cropBoxW.value, h: cropBoxH.value }
}

// ─── Drag move ───────────────────────────────────────────────────────────────
const onMove = (e: MouseEvent | TouchEvent) => {
  if (!dragMode.value) return
  const p = getPointer(e)
  const dx = p.x - dragStartPointer.value.x
  const dy = p.y - dragStartPointer.value.y
  const { x: ox, y: oy, w: ow, h: oh } = dragStartBox.value
  const minSize = props.cropShape === 'circle' || props.cropShape === 'square' ? minCropSize.value : 45
  const isRect = props.cropShape === 'rectangle'
  const isFixed = props.cropShape === 'circle' || props.cropShape === 'square' || isRect
  const aspectRatio = isRect ? (16 / 9) : 1

  const imgLeft = imgOffsetX.value
  const imgTop = imgOffsetY.value
  const imgRight = imgOffsetX.value + imgRenderW.value
  const imgBottom = imgOffsetY.value + imgRenderH.value

  if (dragMode.value === 'move') {
    cropBoxX.value = Math.round(Math.max(imgLeft, Math.min(ox + dx, imgRight - cropBoxW.value)))
    cropBoxY.value = Math.round(Math.max(imgTop, Math.min(oy + dy, imgBottom - cropBoxH.value)))
    return
  }

  const x2 = ox + ow
  const y2 = oy + oh

  let newX = ox, newY = oy, newW = ow, newH = oh

  if (isFixed) {
    if (dragMode.value === 'se') {
      const maxW = Math.min(imgRight - ox, (imgBottom - oy) * aspectRatio)
      newW = Math.max(minSize, Math.min(ow + dx, maxW))
      newH = newW / aspectRatio
    } else if (dragMode.value === 'sw') {
      const maxW = Math.min(x2 - imgLeft, (imgBottom - oy) * aspectRatio)
      newW = Math.max(minSize, Math.min(ow - dx, maxW))
      newH = newW / aspectRatio
      newX = x2 - newW
    } else if (dragMode.value === 'ne') {
      const maxW = Math.min(imgRight - ox, (y2 - imgTop) * aspectRatio)
      newW = Math.max(minSize, Math.min(ow + dx, maxW))
      newH = newW / aspectRatio
      newY = y2 - newH
    } else if (dragMode.value === 'nw') {
      const maxW = Math.min(x2 - imgLeft, (y2 - imgTop) * aspectRatio)
      newW = Math.max(minSize, Math.min(ow - dx, maxW))
      newH = newW / aspectRatio
      newX = x2 - newW
      newY = y2 - newH
    }
  } else {
    // Manual / unlock aspect ratio resize
    if (dragMode.value === 'se') {
      newW = Math.max(minSize, Math.min(ow + dx, imgRight - ox))
      newH = Math.max(minSize, Math.min(oh + dy, imgBottom - oy))
    } else if (dragMode.value === 'sw') {
      newX = Math.max(imgLeft, Math.min(ox + dx, x2 - minSize))
      newW = x2 - newX
      newH = Math.max(minSize, Math.min(oh + dy, imgBottom - oy))
    } else if (dragMode.value === 'ne') {
      newY = Math.max(imgTop, Math.min(oy + dy, y2 - minSize))
      newH = y2 - newY
      newW = Math.max(minSize, Math.min(ow + dx, imgRight - ox))
    } else if (dragMode.value === 'nw') {
      newX = Math.max(imgLeft, Math.min(ox + dx, x2 - minSize))
      newW = x2 - newX
      newY = Math.max(imgTop, Math.min(oy + dy, y2 - minSize))
      newH = y2 - newY
    }
  }

  cropBoxX.value = Math.round(newX)
  cropBoxY.value = Math.round(newY)
  cropBoxW.value = Math.round(newW)
  cropBoxH.value = Math.round(newH)
}

const onEnd = () => {
  dragMode.value = null
}

// ─── Canvas export ───────────────────────────────────────────────────────────
const submitCrop = () => {
  if (!props.imageFile || !cropImage.value || !imageLoaded.value) return

  const fileType = props.imageFile.type || 'image/jpeg'
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const isSwapped = rotation.value === 90 || rotation.value === 270
  const srcW = isSwapped ? naturalH.value : naturalW.value
  const srcH = isSwapped ? naturalW.value : naturalH.value

  // Scale from rendered image coords to natural image coords
  const scaleX = srcW / imgRenderW.value
  const scaleY = srcH / imgRenderH.value

  // Map crop box to natural image coordinates (subtract letterbox offset)
  const natCropX = (cropBoxX.value - imgOffsetX.value) * scaleX
  const natCropY = (cropBoxY.value - imgOffsetY.value) * scaleY
  const natCropW = cropBoxW.value * scaleX
  const natCropH = cropBoxH.value * scaleY

  canvas.width = Math.round(natCropW)
  canvas.height = Math.round(natCropH)

  if (fileType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Apply rotation on an offscreen canvas, then extract crop region
  const offscreen = document.createElement('canvas')
  offscreen.width = srcW
  offscreen.height = srcH
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return

  offCtx.translate(srcW / 2, srcH / 2)
  offCtx.rotate((rotation.value * Math.PI) / 180)
  offCtx.drawImage(cropImage.value, -naturalW.value / 2, -naturalH.value / 2, naturalW.value, naturalH.value)

  ctx.drawImage(offscreen, natCropX, natCropY, natCropW, natCropH, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    if (!blob) return
    const croppedFile = new File([blob], props.imageFile!.name, {
      type: fileType,
      lastModified: Date.now()
    })
    emit('submit', croppedFile)
  }, fileType, 0.92)
}

// ─── Object URL lifecycle ────────────────────────────────────────────────────
watch(() => props.show, (val) => {
  if (!val) {
    imageLoaded.value = false
    rotation.value = 0
    if (previewUrl.value) { URL.revokeObjectURL(previewUrl.value); previewUrl.value = '' }
  } else if (props.imageFile) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(props.imageFile)
    imageLoaded.value = false
  }
}, { immediate: true })

watch(() => props.imageFile, (newFile) => {
  if (props.show && newFile) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(newFile)
    imageLoaded.value = false
  }
})

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>
