import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { shortcutsData } from '@/data/shortcuts'
import { useShortcutsStore } from '~/stores/shortcuts'

interface ShortcutOptions {
  global?: boolean
  searchCallback?: () => void
}

export const useShortcuts = (options: ShortcutOptions = {}) => {
  const router = useRouter()
  const store = useShortcutsStore()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!store.enabled && event.key !== 'Alt') return

    // Handle Alt Mode
    if (event.key === 'Alt') {
      event.preventDefault()
      document.body.classList.add('alt-mode-active')
      return
    }

    // Prevent shortcut if user is typing in an input
    const activeElement = document.activeElement
    const isTyping = activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      (activeElement instanceof HTMLElement && activeElement.isContentEditable)

    if (isTyping) {
      // Allow ONLY Escape to blur the input
      if (event.key === 'Escape') {
        (activeElement as HTMLElement).blur()
      }
      return
    }

    const key = event.key.toLowerCase()

    // Contextual Search Shortcut (Ctrl+K or Cmd+K)
    if ((event.ctrlKey || event.metaKey) && key === 'k') {
      if (options.searchCallback) {
        event.preventDefault()
        options.searchCallback()
      }
    }

    // Global Navigation Shortcuts
    const isAltActive = event.altKey || document.body.classList.contains('alt-mode-active')
    if (event.shiftKey || isAltActive) {
      // Find matching shortcut in our centralized data
      const shortcut = Object.values(shortcutsData).find(s =>
        s.isGlobal && s.modifier === 'Shift' && s.key === key
      )

      if (shortcut?.path) {
        if (isAltActive) event.preventDefault()
        router.push(shortcut.path)
        // Auto-close alt mode on use
        document.body.classList.remove('alt-mode-active')
      } else if ((event.shiftKey && key === '?') || (isAltActive && key === '/')) {
        router.push('/help/shortcuts')
      }
    }

    // Single key shortcuts (if not typing)
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      if (event.key === '?') {
        router.push('/help/shortcuts')
      }
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Alt') {
      document.body.classList.remove('alt-mode-active')
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', () => {
      document.body.classList.remove('alt-mode-active')
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })
}
