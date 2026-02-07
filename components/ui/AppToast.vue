<template>
  <Teleport to="body">
    <Transition enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="-translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" :role="type === 'error' || type === 'warning' ? 'alert' : 'status'"
        :aria-live="type === 'error' || type === 'warning' ? 'assertive' : 'polite'" aria-labelledby="toast-title"
        aria-describedby="toast-message"
        class="fixed top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-[9999] max-w-[calc(100%-2.5rem)] sm:max-w-sm w-full bg-WtB shadow-2xl rounded-2xl border pointer-events-auto overflow-hidden text-left"
        :class="containerClass">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component :is="icon" class="h-6 w-6" :class="iconClass" aria-hidden="true" />
            </div>

            <!-- Contenu textuel -->
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p id="toast-title" class="text-sm font-bold" :class="textClass">
                {{ title }}
              </p>
              <p id="toast-message" class="mt-1 text-sm text-hsa line-clamp-4">
                {{ message }}
              </p>
            </div>

            <!-- Bouton de fermeture -->
            <div class="ml-4 flex-shrink-0 flex">
              <UiBaseButton variant="ghost"
                class="!rounded-md !inline-flex text-hsa hover:!text-BtW focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors !p-1 !h-auto !w-auto"
                @click="close">
                <span class="sr-only">Fermer</span>
                <IconX class="h-5 w-5" aria-hidden="true" />
              </UiBaseButton>
            </div>
          </div>
        </div>

        <!-- Barre de progression temporelle -->
        <div class="h-1 bg-ash overflow-hidden">
          <div class="h-full transition-all duration-100 ease-linear" :class="progressClass"
            :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle, IconCircleX } from '@tabler/icons-vue'

// Interface des propriétés du Toast
interface Props {
  modelValue: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  type: 'info',
  title: '',
  duration: 5000
})

const emit = defineEmits(['update:modelValue', 'close'])

const progress = ref(100)
let timer: any = null
let progressInterval: any = null

// Fermeture manuelle du toast
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Lancement du minuteur de disparition
const startTimer = () => {
  if (timer) clearTimeout(timer)
  if (progressInterval) clearInterval(progressInterval)

  progress.value = 100

  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)

    const tick = 100 / (props.duration / 100)
    progressInterval = setInterval(() => {
      progress.value -= tick
      if (progress.value <= 0) clearInterval(progressInterval)
    }, 100)
  }
}

// Surveillance de la visibilité
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    startTimer()
  } else {
    if (timer) clearTimeout(timer)
    if (progressInterval) clearInterval(progressInterval)
  }
})

// Détermination de l'icône selon le type
const icon = computed(() => {
  switch (props.type) {
    case 'success': return IconCheck
    case 'error': return IconCircleX
    case 'warning': return IconAlertTriangle
    default: return IconInfoCircle
  }
})

// Classes de bordure selon le type
const containerClass = computed(() => {
  switch (props.type) {
    case 'success': return 'border-success/30'
    case 'error': return 'border-danger/30'
    case 'warning': return 'border-warning/30'
    default: return 'border-ash'
  }
})

// Classes de couleur d'icône
const iconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-success'
    case 'error': return 'text-danger'
    case 'warning': return 'text-warning'
    default: return 'text-primary'
  }
})

// Classes de couleur de texte
const textClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-success'
    case 'error': return 'text-danger'
    case 'warning': return 'text-warning'
    default: return 'text-BtW'
  }
})

// Classes de couleur de la barre de progression
const progressClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-success'
    case 'error': return 'bg-danger'
    case 'warning': return 'bg-warning'
    default: return 'bg-primary'
  }
})

onMounted(() => {
  if (props.modelValue) startTimer()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (progressInterval) clearInterval(progressInterval)
})
</script>
