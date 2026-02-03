import { ref, onUnmounted } from 'vue'

const isDragging = ref(false)
const dragCounter = ref(0)
const activeHandlers = ref<((file: File) => void)[]>([])

export const useGlobalDropZone = () => {
  const isEnabled = ref(false)

  const enable = (handler: (file: File) => void) => {
    isEnabled.value = true
    activeHandlers.value.push(handler)
  }

  const disable = (handler: (file: File) => void) => {
    isEnabled.value = false
    activeHandlers.value = activeHandlers.value.filter(h => h !== handler)
  }

  const handleGlobalDrop = (file: File) => {
    if (activeHandlers.value.length > 0) {
      activeHandlers.value[activeHandlers.value.length - 1](file)
    }
  }

  return {
    isDragging,
    dragCounter,
    isEnabled,
    activeHandlers,
    enable,
    disable,
    handleGlobalDrop
  }
}
