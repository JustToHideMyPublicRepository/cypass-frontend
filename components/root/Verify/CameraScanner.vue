<template>
  <div class="space-y-4">
    <div class="relative aspect-video bg-black rounded-2xl overflow-hidden border border-ashAct shadow-inner group">
      <video ref="video" autoplay playsinline class="w-full h-full object-cover"></video>

      <!-- Overlay for framing -->
      <div v-if="!capturedImage" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-64 h-64 border-2 border-primary/50 rounded-3xl border-dashed"></div>
        <div class="absolute inset-0 bg-black/20"></div>
      </div>

      <!-- Result Preview -->
      <div v-if="capturedImage" class="absolute inset-0 bg-black">
        <img :src="capturedImage" class="w-full h-full object-cover" />
      </div>

      <!-- Error State -->
      <div v-if="error"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-WtB p-6 text-center">
        <IconCameraOff class="w-12 h-12 mb-4 text-danger" />
        <p class="font-bold mb-2">{{ errorTitle }}</p>
        <p class="text-sm opacity-80">{{ error }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !error" class="absolute inset-0 flex items-center justify-center bg-black/40">
        <UiLogoLoader class="w-16 h-16" />
      </div>
    </div>

    <div class="flex justify-center gap-4">
      <template v-if="!capturedImage">
        <UiBaseButton variant="ghost" @click="$emit('cancel')">
          Annuler
        </UiBaseButton>
        <UiBaseButton :disabled="loading || !!error" @click="capture">
          <template #icon>
            <IconCamera class="w-5 h-5" />
          </template>
          Capturer le QR Code
        </UiBaseButton>
      </template>

      <template v-else>
        <UiBaseButton variant="ghost" @click="reset">
          Recommencer
        </UiBaseButton>
        <UiBaseButton @click="confirm">
          Utiliser cette photo
        </UiBaseButton>
      </template>
    </div>

    <!-- Hidden canvas for capturing -->
    <canvas ref="canvas" class="hidden"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconCamera, IconCameraOff, IconRefresh } from '@tabler/icons-vue'

const emit = defineEmits(['capture', 'cancel'])

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const errorTitle = ref('Accès caméra refusé')
const capturedImage = ref<string | null>(null)
const capturedBlob = ref<Blob | null>(null)

const startCamera = async () => {
  loading.value = true
  error.value = null

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })

    if (video.value) {
      video.value.srcObject = stream.value
    }
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      error.value = 'Veuillez autoriser l\'accès à votre caméra dans les paramètres de votre navigateur.'
    } else if (err.name === 'NotFoundError') {
      errorTitle.value = 'Caméra introuvable'
      error.value = 'Aucune caméra n\'a été détectée sur votre appareil.'
    } else {
      errorTitle.value = 'Erreur technique'
      error.value = 'Impossible d\'accéder à la caméra.'
    }
  } finally {
    loading.value = false
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

const capture = () => {
  if (!video.value || !canvas.value) return

  const v = video.value
  const c = canvas.value

  c.width = v.videoWidth
  c.height = v.videoHeight

  const ctx = c.getContext('2d')
  if (ctx) {
    ctx.drawImage(v, 0, 0, c.width, c.height)
    capturedImage.value = c.toDataURL('image/jpeg')

    c.toBlob((blob) => {
      capturedBlob.value = blob
    }, 'image/jpeg')

    stopCamera()
  }
}

const reset = () => {
  capturedImage.value = null
  capturedBlob.value = null
  startCamera()
}

const confirm = () => {
  if (capturedBlob.value) {
    const file = new File([capturedBlob.value], 'qr-capture.jpg', { type: 'image/jpeg' })
    emit('capture', file)
  }
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>
