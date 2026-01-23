import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { shortcutsData } from '@/data/shortcuts'

interface ShortcutOptions {
  global?: boolean
  searchCallback?: () => void
}

export const useShortcuts = (options: ShortcutOptions = {}) => {
  const router = useRouter()

  const handleKeyDown = (event: KeyboardEvent) => {
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

    // Global Navigation Shortcuts (Shift + char)
    if (event.shiftKey) {
      // Find matching shortcut in our centralized data
      const shortcut = Object.values(shortcutsData).find(s =>
        s.isGlobal && s.modifier === 'Shift' && s.key === key
      )

      if (shortcut?.path) {
        router.push(shortcut.path)
      } else if (key === '?') {
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

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
