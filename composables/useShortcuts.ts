import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShortcutsStore } from '~/stores/shortcuts'
import { useAuthStore } from '~/stores/auth'
import { useShortcutModeAlt } from './useShortcutModeAlt'
import { useShortcutModeShift } from './useShortcutModeShift'

interface ShortcutsOptions {
  global?: boolean
  searchCallback?: () => void
  localSearchCallback?: () => void
  onAltModeChange?: (active: boolean) => void
}

/**
 * Composable useShortcuts
 * 
 * Point d'entrée principal pour la gestion des raccourcis clavier.
 * Orchestre le mode Alt, les séquences et les raccourcis simples.
 */
export const useShortcuts = (options: ShortcutsOptions = {}) => {
  const router = useRouter()
  const store = useShortcutsStore()
  const authStore = useAuthStore()

  const { updateVisualHints } = useShortcutModeAlt()
  const { handleShiftSequence } = useShortcutModeShift()

  /**
   * Gestionnaire principal des événements clavier
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!store.enabled && event.key !== 'Alt') return

    // Gestion du Mode ALT
    if (event.key === 'Alt') {
      if (!event.repeat) {
        event.preventDefault()
        store.toggleAltMode()
        updateVisualHints()
      }
      return
    }

    if (store.altMode) {
      handleAltModeBehavior(event)
      return
    }

    // Vérification de l'état de saisie (ignorer les raccourcis si l'utilisateur écrit)
    const activeElement = document.activeElement
    const isTyping = activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      (activeElement instanceof HTMLElement && activeElement.isContentEditable)

    if (isTyping) {
      if (event.key === 'Escape') (activeElement as HTMLElement).blur()
      return
    }

    // Raccourcis standards et Séquences
    processStandardShortcuts(event)
  }

  /**
   * Comportement spécifique lorsque le mode Alt est actif
   */
  const handleAltModeBehavior = (event: KeyboardEvent) => {
    event.preventDefault()
    const key = event.key.toLowerCase()

    if (['shift', 'control', 'meta'].includes(key)) return

    if (key === 'escape') {
      store.disableAltMode()
      updateVisualHints()
      return
    }

    store.addToBuffer(key)
    updateVisualHints()

    const currentBuffer = store.buffer.map(k => k.toLowerCase())
    const exactMatch = Object.values(store.mergedShortcuts).find(s => {
      if (!s.isGlobal) return false
      return s.keys.length === currentBuffer.length &&
        s.keys.every((k, i) => k.toLowerCase() === currentBuffer[i])
    })

    if (exactMatch?.path) {
      router.push(exactMatch.path)
      store.disableAltMode()
      updateVisualHints()
    } else {
      const potentialMatches = Object.values(store.mergedShortcuts).filter(s => {
        if (!s.isGlobal) return false
        return s.keys.length > currentBuffer.length &&
          s.keys.slice(0, currentBuffer.length).every((k, i) => k.toLowerCase() === currentBuffer[i])
      })
      if (potentialMatches.length === 0 && !exactMatch) {
        // Aucun chemin valide trouvé
      }
    }
  }

  /**
   * Traitement des raccourcis clavier classiques et des combinaisons (Ctrl/Shift)
   */
  const processStandardShortcuts = (event: KeyboardEvent) => {
    if (!event.key) return
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey

    // Recherche contextuelle (recherche globale ou locale)
    if (ctrl && key === 'k') {
      event.preventDefault()
      if (event.shiftKey && options.searchCallback) options.searchCallback()
      else if (!event.shiftKey && options.localSearchCallback) options.localSearchCallback()
      return
    }

    // Actions système (Logout, Thème)
    if (ctrl && event.shiftKey) {
      if (key === 'd' && authStore.user) {
        event.preventDefault()
        authStore.openLogoutModal()
        return
      }
      if (key === 'l') {
        event.preventDefault()
        const colorMode = useColorMode()
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
        return
      }
    }

    // Aide et Overlay
    if (key === '?' || (event.key === ' ' && !ctrl && !event.shiftKey)) {
      event.preventDefault()
      if (key === '?') router.push('/system/shortcuts')
      else store.toggleHelp()
      return
    }

    // Navigation Shift + Flèches
    if (event.shiftKey && !ctrl && !event.altKey) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
          break
        case 'ArrowUp':
          event.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break
        case 'ArrowLeft':
          event.preventDefault()
          router.back()
          break
        case 'ArrowRight':
          event.preventDefault()
          router.forward()
          break
        default:
          if (!['shift', 'control', 'meta', 'alt'].includes(key)) {
            event.preventDefault()
            handleShiftSequence(key)
          }
      }
    }
  }

  const handleClick = () => {
    if (store.altMode) {
      store.disableAltMode()
      updateVisualHints()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)
    window.addEventListener('blur', () => {
      store.disableAltMode()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('click', handleClick)
  })
}


