<template>
  <UiBaseModal :show="show" title="Aperçu de la photo" maxWidth="xl" @close="$emit('close')">
    <div class="relative bg-black/5 rounded-2xl overflow-hidden group">
      <!-- Image Container with Transformations -->
      <div class="h-[400px] flex items-center justify-center overflow-hidden cursor-move active:cursor-grabbing"
        @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag"
        @wheel.prevent="handleWheel">
        <img :src="imageUrl" alt="Aperçu"
          class="max-h-full max-w-full object-contain transition-transform duration-200 ease-out select-none"
          :style="imageStyle" draggable="false" />
      </div>

      <!-- Toolbar -->
      <div
        class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-WtB/90 backdrop-blur-2xl px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-ash opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <UiBaseButton @click="rotate(-90)" variant="ghost"
          class="!p-2 hover:!bg-primary/10 !rounded-xl hover:!text-primary transition-colors !h-auto !w-auto"
          title="Pivoter à gauche">
          <IconRotate2 class="w-5 h-5" />
        </UiBaseButton>
        <div class="w-px h-6 bg-ash/50"></div>
        <UiBaseButton @click="zoomOut" variant="ghost"
          class="!p-2 hover:!bg-primary/10 !rounded-xl hover:!text-primary transition-colors !h-auto !w-auto"
          title="Dézoomer">
          <IconZoomOut class="w-5 h-5" />
        </UiBaseButton>
        <span class="text-xs font-code font-bold text-primary min-w-[3rem] text-center">{{ Math.round(scale * 100)
        }}%</span>
        <UiBaseButton @click="zoomIn" variant="ghost"
          class="!p-2 hover:!bg-primary/10 !rounded-xl hover:!text-primary transition-colors !h-auto !w-auto"
          title="Zoomer">
          <IconZoomIn class="w-5 h-5" />
        </UiBaseButton>
        <div class="w-px h-6 bg-ash/50"></div>
        <UiBaseButton @click="rotate(90)" variant="ghost"
          class="!p-2 hover:!bg-primary/10 !rounded-xl hover:!text-primary transition-colors !h-auto !w-auto"
          title="Pivoter à droite">
          <IconRotateClockwise2 class="w-5 h-5" />
        </UiBaseButton>
        <div class="w-px h-6 bg-ash/50"></div>
        <UiBaseButton @click="reset" variant="ghost"
          class="!p-2 hover:!bg-primary/10 !rounded-xl hover:!text-primary transition-colors !h-auto !w-auto"
          title="Réinitialiser">
          <IconRefresh class="w-5 h-5" />
        </UiBaseButton>
      </div>

      <!-- Helper Text -->
      <div
        class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span class="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] text-white font-bold">
          Molette pour zoomer • Glisser pour déplacer
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <UiBaseButton variant="ghost" @click="$emit('close')">Fermer</UiBaseButton>
        <UiBaseButton variant="primary" @click="downloadImage">
          <IconDownload class="w-4 h-4 mr-2" /> Télécharger
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  IconZoomIn, IconZoomOut, IconRotate2, IconRotateClockwise2,
  IconRefresh, IconDownload
} from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  imageUrl: string
}>()

const emit = defineEmits(['close'])

const scale = ref(1)
const rotation = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

const imageStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) rotate(${rotation.value}deg) scale(${scale.value})`
}))

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, 4)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.5)
}

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY < 0) zoomIn()
  else zoomOut()
}

const rotate = (deg: number) => {
  rotation.value += deg
}

const reset = () => {
  scale.value = 1
  rotation.value = 0
  translateX.value = 0
  translateY.value = 0
}

const startDrag = (e: MouseEvent) => {
  if (scale.value > 1) {
    isDragging.value = true
    startX.value = e.clientX - translateX.value
    startY.value = e.clientY - translateY.value
  }
}

const onDrag = (e: MouseEvent) => {
  if (isDragging.value) {
    translateX.value = e.clientX - startX.value
    translateY.value = e.clientY - startY.value
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = props.imageUrl
  link.download = 'profile-image'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(() => props.show, (newVal) => {
  if (newVal) reset()
})
</script>
