import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShortcutsStore } from '~/stores/shortcuts'

/**
 * Composable pour gérer les séquences de touches avec Shift
 */
export const useShortcutModeShift = () => {
  const router = useRouter()
  const store = useShortcutsStore()

  const shiftBuffer = ref<string[]>([])
  let shiftBufferTimeout: any = null

  const resetShiftBuffer = () => {
    shiftBuffer.value = []
    if (shiftBufferTimeout) clearTimeout(shiftBufferTimeout)
  }

  /**
   * Traite une nouvelle touche dans une séquence Shift
   */
  const handleShiftSequence = (key: string) => {
    shiftBuffer.value.push(key)
    if (shiftBufferTimeout) clearTimeout(shiftBufferTimeout)
    shiftBufferTimeout = setTimeout(resetShiftBuffer, 1000)

    const currentBuffer = [...shiftBuffer.value]

    // Rechercher une correspondance dans les raccourcis configurés
    const matches = Object.values(store.mergedShortcuts).filter(s => {
      if (!s.isGlobal || s.modifier !== 'Shift') return false
      return s.keys.slice(0, currentBuffer.length).every((k, i) => k.toLowerCase() === currentBuffer[i])
    })

    const exactMatch = matches.find(s => s.keys.length === currentBuffer.length)

    if (exactMatch?.path) {
      router.push(exactMatch.path)
      resetShiftBuffer()
    } else if (matches.length === 0) {
      resetShiftBuffer()
    }
  }

  return {
    handleShiftSequence,
    resetShiftBuffer
  }
}
