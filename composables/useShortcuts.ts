import { onMounted, onUnmounted, ref } from 'vue'
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

  const keyBuffer = ref<string[]>([])
  let bufferTimeout: any = null

  const resetBuffer = () => {
    keyBuffer.value = []
    if (bufferTimeout) clearTimeout(bufferTimeout)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!store.enabled && event.key !== 'Alt') return

    // Handle Alt Mode (Quick navigation)
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
      if (event.key === 'Escape') (activeElement as HTMLElement).blur()
      return
    }

    if (!event.key) return
    const key = event.key.toLowerCase()

    // Contextual Search Shortcut (Ctrl+K or Cmd+K)
    if ((event.ctrlKey || event.metaKey) && key === 'k') {
      if (options.searchCallback) {
        event.preventDefault()
        options.searchCallback()
      }
      return
    }

    // Global and Sequence Shortcuts (Modifier based)
    const isAltActive = event.altKey || document.body.classList.contains('alt-mode-active')
    const modifier = event.shiftKey ? 'Shift' : (isAltActive ? 'Alt' : null)

    if (modifier === 'Shift' || isAltActive) {
      // Add key to buffer (ignore modifier keys themselves)
      if (['shift', 'alt', 'control', 'meta'].includes(key)) return

      keyBuffer.value.push(key)
      if (bufferTimeout) clearTimeout(bufferTimeout)
      bufferTimeout = setTimeout(resetBuffer, 1000)

      // Try to find a match for the current buffer
      const currentBuffer = [...keyBuffer.value]
      const matches = Object.values(shortcutsData).filter(s => {
        if (!s.isGlobal) return false
        // Match modifier
        if (s.modifier !== (isAltActive ? 'Shift' : modifier)) {
          if (!isAltActive || s.modifier !== 'Shift') return false
        }

        // Match sequence prefix
        return s.keys.slice(0, currentBuffer.length).every((k, i) => k === currentBuffer[i])
      })

      const exactMatch = matches.find(s => s.keys.length === currentBuffer.length)

      if (exactMatch?.path) {
        if (isAltActive) event.preventDefault()
        router.push(exactMatch.path)
        resetBuffer()
        document.body.classList.remove('alt-mode-active')
      } else if (matches.length === 0) {
        // Special case for help
        if (key === '?' || (isAltActive && key === '/')) {
          router.push('/help/shortcuts')
          resetBuffer()
        } else {
          // No possible match, reset
          resetBuffer()
        }
      } else {
        event.preventDefault()
      }
    }

    // Single key shortcuts (if not typing and no modifiers)
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      if (event.key === '?') {
        router.push('/help/shortcuts')
      }
      // Space to toggle help
      if (event.key === ' ') {
        event.preventDefault()
        store.toggleHelp()
      }
    }

    // Shift + Arrow shortcuts (scroll and history)
    if (event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
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
      resetBuffer()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })
}
