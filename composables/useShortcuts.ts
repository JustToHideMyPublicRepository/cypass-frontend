import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useShortcutsStore } from '~/stores/shortcuts'
import { useAuthStore } from '~/stores/auth'

interface ShortcutsOptions {
  global?: boolean
  searchCallback?: () => void
  localSearchCallback?: () => void
  onAltModeChange?: (active: boolean) => void
}

export const useShortcuts = (options: ShortcutsOptions = {}) => {
  const router = useRouter()
  const store = useShortcutsStore()
  const authStore = useAuthStore()

  // Logique de mise à jour visuelle des indices de raccourcis
  const updateVisualHints = () => {
    if (!import.meta.client) return

    // Différer au prochain frame pour s'assurer que les mises à jour du store sont propagées
    requestAnimationFrame(() => {
      const hints = document.querySelectorAll('.alt-shortcut-hint')
      const buffer = store.buffer.map(k => k.toLowerCase())

      hints.forEach(el => {
        const hint = el as HTMLElement
        const seq = (hint.dataset.seq || '').split(',') // ["l", "m", "p"]

        // Vérifier si le tampon correspond au début de cette séquence
        const matches = buffer.every((k, i) => seq[i] === k)

        if (!matches) {
          hint.classList.add('dimmed')
          // Réinitialiser les touches actives
          hint.querySelectorAll('.key').forEach(k => k.classList.remove('active'))
        } else {
          hint.classList.remove('dimmed')
          // Mettre en surbrillance les touches actives selon la progression
          const keys = hint.querySelectorAll('.key:not(.is-mod)')
          keys.forEach((k, i) => {
            if (i < buffer.length) k.classList.add('active')
            else k.classList.remove('active')
          })
        }
      })
    })
  }

  // Synchronisation de la classe du body et des indices visuels avec l'état du store
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

    // Vérifier les correspondances
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

    // Basculer le Mode Alt (Touche collante)
    if (event.key === 'Alt') {
      if (!event.repeat) {
        event.preventDefault()
        store.toggleAltMode()
        updateVisualHints()
      }
      return
    }

    // Si le Mode Alt est actif, intercepter les touches
    if (store.altMode) {
      event.preventDefault() // Bloquer l'interaction normale dans ce mode

      const key = event.key.toLowerCase()
      // Ignorer les pressions de touches de modification isolées
      if (['shift', 'control', 'meta'].includes(key)) return

      // Échappe pour annuler
      if (key === 'escape') {
        store.disableAltMode()
        updateVisualHints()
        return
      }

      // Ajouter au tampon
      store.addToBuffer(key)
      updateVisualHints()

      // Vérifier les correspondances
      const currentBuffer = store.buffer.map(k => k.toLowerCase())

      // Trouver une correspondance exacte
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
        // Vérifier si une séquence valide subsiste
        const potentialMatches = Object.values(store.mergedShortcuts).filter(s => {
          if (!s.isGlobal) return false
          return s.keys.length > currentBuffer.length &&
            s.keys.slice(0, currentBuffer.length).every((k, i) => k.toLowerCase() === currentBuffer[i])
        })

        if (potentialMatches.length === 0 && !exactMatch) {
          // Aucun chemin valide, l'utilisateur verra l'état grisé
        }
      }
      return
    }

    // Logique des raccourcis standards
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

    // Raccourci Recherche Contextuelle (Ctrl+Shift+K)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'k') {
      if (options.searchCallback) {
        event.preventDefault()
        options.searchCallback()
      }
      return
    }

    // Raccourci Recherche Locale (Ctrl+K)
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && key === 'k') {
      if (options.localSearchCallback) {
        event.preventDefault()
        options.localSearchCallback()
      }
      return
    }

    // Raccourci Déconnexion (Ctrl + Shift + D par défaut)
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

    // Basculer le Thème (Ctrl + Shift + L par défaut)
    const toggleThemeShortcut = store.mergedShortcuts.toggle_theme
    const ttKeys = toggleThemeShortcut.keys[0].toLowerCase()
    const ttModifier = toggleThemeShortcut.modifier

    if (ttModifier === 'Ctrl + Shift' && (event.ctrlKey || event.metaKey) && event.shiftKey && key === ttKeys) {
      event.preventDefault()
      const colorMode = useColorMode()
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
      return
    }

    // Raccourci d'aide (Dynamique)
    const helpShortcut = store.mergedShortcuts.help
    const hKeys = helpShortcut.keys[0].toLowerCase()
    const hMod = helpShortcut.modifier

    let isMatch = false
    if (!hMod && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && key === hKeys) isMatch = true
    else if (hMod === 'Shift' && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey && key === hKeys) isMatch = true

    // Cas spécial pour '?' qui nécessite souvent Shift mais event.key est '?'
    if (event.key === hKeys && !event.ctrlKey && !event.metaKey && !event.altKey) isMatch = true

    if (isMatch) {
      event.preventDefault()
      router.push(helpShortcut.path || '/system/shortcuts')
      return
    }

    // Navigation Shift Standard (Séquence Shift + Touche)
    if (event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (['shift', 'control', 'meta', 'alt'].includes(key)) return

      // Gérer les touches fléchées séparément (défilement/historique)
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        // Laisser passer pour la logique des flèches ci-dessous
      } else {
        event.preventDefault()
        handleShiftSequence(key)
        return
      }
    }

    // Toggle global (Dynamique)
    const toggleShortcut = store.mergedShortcuts.toggle_help_modal
    const tKeys = toggleShortcut.keys[0].toLowerCase()
    const tMod = toggleShortcut.modifier

    if (!tMod && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && (key === tKeys || event.key === ' ')) {
      event.preventDefault()
      store.toggleHelp()
    }

    // Raccourcis Shift + Flèches (défilement et historique)
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

  // Gestion des clics extérieurs pour fermer le mode Alt
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
      // Désactiver également le mode collant lors d'une perte de focus
      store.disableAltMode()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('click', handleClick)
  })
}

