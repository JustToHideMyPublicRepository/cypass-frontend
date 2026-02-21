import { ref, onUnmounted } from 'vue'

// État partagé pour le drag & drop global
const isDragging = ref(false)
const dragCounter = ref(0)
const activeHandlers = ref<((file: File) => void)[]>([])

/**
 * Composable useGlobalDropZone
 * 
 * Gère l'état et les gestionnaires de dépôt de fichiers (Drag & Drop) au niveau global de l'application.
 */
export const useGlobalDropZone = () => {
  const isEnabled = ref(false)

  /**
   * Active le dropzone et ajoute un gestionnaire de fichiers
   */
  const enable = (handler: (file: File) => void) => {
    isEnabled.value = true
    activeHandlers.value.push(handler)
  }

  /**
   * Désactive le dropzone et retire le gestionnaire de fichiers
   */
  const disable = (handler: (file: File) => void) => {
    isEnabled.value = false
    activeHandlers.value = activeHandlers.value.filter(h => h !== handler)
  }

  /**
   * Déclenche le dernier gestionnaire actif lors d'un dépôt de fichier
   */
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
