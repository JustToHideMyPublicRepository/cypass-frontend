import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { shortcutsData } from '@/data/shortcuts'
import { useShortcutsStore } from '~/stores/shortcuts'

interface ShortcutsOptions {
  global?: boolean
  searchCallback?: () => void
  localSearchCallback?: () => void
  onAltModeChange?: (active: boolean) => void
}

import { useAuthStore } from '~/stores/auth'

export const useShortcuts = (options: ShortcutsOptions = {}) => {
  const router = useRouter()
  const store = useShortcutsStore()
  const authStore = useAuthStore()

  // Visual update logic for hints
  const updateVisualHints = () => {
    if (!import.meta.client) return

    // Defer to next tick to ensure store updates are propagated if needed,
    requestAnimationFrame(() => {
      const hints = document.querySelectorAll('.alt-shortcut-hint')
      const buffer = store.buffer.map(k => k.toLowerCase())

      hints.forEach(el => {
        const hint = el as HTMLElement
        const seq = (hint.dataset.seq || '').split(',') // ["l", "m", "p"]

        // Check if buffer matches the start of this sequence
        const matches = buffer.every((k, i) => seq[i] === k)

        if (!matches) {
          hint.classList.add('dimmed')
          // Reset active keys
          hint.querySelectorAll('.key').forEach(k => k.classList.remove('active'))
        } else {
          hint.classList.remove('dimmed')
          // Highlight active keys based on progress (skipping modifiers like Shift)
          const keys = hint.querySelectorAll('.key:not(.is-mod)')
          keys.forEach((k, i) => {
            if (i < buffer.length) k.classList.add('active')
            else k.classList.remove('active')
          })
        }
      })
    })
  }

  // Synchro body class and visual hints with store state
  watch(() => store.altMode, (active) => {
    if (import.meta.client) {
      if (active) {
        document.body.classList.add('alt-mode-active')
        updateVisualHints()
      } else {
        document.body.classList.remove('alt-mode-active')
      }
    }
  })

  const shiftBuffer = ref<string[]>([])
  let shiftBufferTimeout: any = null

  const resetShiftBuffer = () => {
    shiftBuffer.value = []
    if (shiftBufferTimeout) clearTimeout(shiftBufferTimeout)
  }

  const handleShiftSequence = (key: string) => {
    shiftBuffer.value.push(key)
    if (shiftBufferTimeout) clearTimeout(shiftBufferTimeout)
    shiftBufferTimeout = setTimeout(resetShiftBuffer, 1000)

    const currentBuffer = [...shiftBuffer.value]

    // Check for matches
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!store.enabled && event.key !== 'Alt') return

    // Sticky Alt Mode Toggle
    if (event.key === 'Alt') {
      if (!event.repeat) {
        event.preventDefault()
        store.toggleAltMode()
        updateVisualHints()
      }
      return
    }

    // If Alt Mode is active, intercept keys
    if (store.altMode) {
      event.preventDefault() // Block normal interaction while in mode

      const key = event.key.toLowerCase()
      // Ignore separate modifier presses
      if (['shift', 'control', 'meta'].includes(key)) return

      // Escape to cancel
      if (key === 'escape') {
        store.disableAltMode()
        updateVisualHints()
        return
      }

      // Add to buffer
      store.addToBuffer(key)
      updateVisualHints()

      // Check for matches
      const currentBuffer = store.buffer.map(k => k.toLowerCase())

      // Find exact match
      const exactMatch = Object.values(store.mergedShortcuts).find(s => {
        if (!s.isGlobal) return false
        if (s.keys.length !== currentBuffer.length) return false
        return s.keys.every((k, i) => k.toLowerCase() === currentBuffer[i])
      })

      if (exactMatch?.path) {
        router.push(exactMatch.path)
        store.disableAltMode()
        updateVisualHints()
      } else {
        // Check if any valid sequence remains
        const potentialMatches = Object.values(store.mergedShortcuts).filter(s => {
          if (!s.isGlobal) return false
          return s.keys.length > currentBuffer.length &&
            s.keys.slice(0, currentBuffer.length).every((k, i) => k.toLowerCase() === currentBuffer[i])
        })

        if (potentialMatches.length === 0 && !exactMatch) {
          // Invalid path taken, maybe reset or feedback? 
          // For now, let user see the dimmed state and decide to Escape or Alt to reset
        }
      }
      return
    }

    // Standard shortcuts logic
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

    // Contextual Search Shortcut (Ctrl+Shift+K)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'k') {
      if (options.searchCallback) {
        event.preventDefault()
        options.searchCallback()
      }
      return
    }

    // Local Search Shortcut (Ctrl+K)
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && key === 'k') {
      if (options.localSearchCallback) {
        event.preventDefault()
        options.localSearchCallback()
      }
      return
    }

    // Logout Shortcut (Ctrl + Shift + D by default)
    const logoutShortcut = store.mergedShortcuts.logout
    const lKeys = logoutShortcut.keys[0].toLowerCase()
    const lModifier = logoutShortcut.modifier

    if (lModifier === 'Ctrl + Shift' && (event.ctrlKey || event.metaKey) && event.shiftKey && key === lKeys) {
      event.preventDefault()
      if (authStore.user) {
        authStore.openLogoutModal()
      }
      return
    }

    // Theme Toggle (Ctrl + Shift + L by default)
    const toggleThemeShortcut = store.mergedShortcuts.toggle_theme
    const ttKeys = toggleThemeShortcut.keys[0].toLowerCase()
    const ttModifier = toggleThemeShortcut.modifier

    if (ttModifier === 'Ctrl + Shift' && (event.ctrlKey || event.metaKey) && event.shiftKey && key === ttKeys) {
      event.preventDefault()
      const colorMode = useColorMode()
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
      return
    }

    // Help shortcut (Dynamic)
    const helpShortcut = store.mergedShortcuts.help
    const hKeys = helpShortcut.keys[0].toLowerCase()
    const hMod = helpShortcut.modifier

    let isMatch = false
    if (!hMod && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && key === hKeys) isMatch = true
    else if (hMod === 'Shift' && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey && key === hKeys) isMatch = true

    // Special case for '?' which often requires shift but event.key is '?'
    if (event.key === hKeys && !event.ctrlKey && !event.metaKey && !event.altKey) isMatch = true

    if (isMatch) {
      event.preventDefault()
      router.push(helpShortcut.path || '/shortcuts')
      return
    }

    // Legacy/Standard Shift Navigation (Shift + Key sequence)
    if (event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (['shift', 'control', 'meta', 'alt'].includes(key)) return

      // Handle Arrow keys separately (scroll/history)
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        // Fall through to arrow logic below
      } else {
        event.preventDefault()
        handleShiftSequence(key)
        return
      }
    }

    // Global toggle (Dynamic)
    const toggleShortcut = store.mergedShortcuts.toggle_help_modal
    const tKeys = toggleShortcut.keys[0].toLowerCase()
    const tMod = toggleShortcut.modifier

    if (!tMod && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && (key === tKeys || event.key === ' ')) {
      event.preventDefault()
      store.toggleHelp()
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

  // Handle outside clicks to close Alt mode
  const handleClick = (e: MouseEvent) => {
    if (store.altMode) {
      store.disableAltMode()
      updateVisualHints()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)
    window.addEventListener('blur', () => {
      document.body.classList.remove('alt-mode-active')
      // Also disable sticky mode on blur
      store.disableAltMode()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('click', handleClick)
  })
}
