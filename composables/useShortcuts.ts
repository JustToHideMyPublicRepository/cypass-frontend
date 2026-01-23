import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

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

    // Contextual Search Shortcut (Ctrl+K or Cmd+K)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      if (options.searchCallback) {
        event.preventDefault()
        options.searchCallback()
      }
    }

    // Global Navigation Shortcuts (Shift + char)
    if (event.shiftKey) {
      switch (event.key.toLowerCase()) {
        case 'h': // Home
          router.push('/')
          break
        case 'l': // Login
          router.push('/auth/login')
          break
        case 'p': // Profile
          router.push('/dashboard/profile')
          break
        case 'm': // Legal Mentions
          router.push('/legal/mentions')
          break
        case 's': // Support
          router.push('/support')
          break
        case 'a': // About
          router.push('/about')
          break
        case 'c': // Contact
          router.push('/contact')
          break
        case 'f': // FAQ
          router.push('/faq')
          break
        case 'd': // Developers
          router.push('/developers')
          break
        case 't': // Status
          router.push('/status')
          break
        case '?': // Help
          router.push('/help/shortcuts')
          break
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
