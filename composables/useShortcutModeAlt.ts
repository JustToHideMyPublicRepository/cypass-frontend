import { watch } from 'vue'
import { useShortcutsStore } from '~/stores/shortcuts'

/**
 * Composable pour gérer l'état et l'affichage du mode ALT
 */
export const useShortcutModeAlt = () => {
  const store = useShortcutsStore()

  // Mise à jour visuelle des indices de touches sur l'interface
  const updateVisualHints = () => {
    if (!import.meta.client) return

    requestAnimationFrame(() => {
      const hints = document.querySelectorAll('.alt-shortcut-hint')
      const buffer = store.buffer.map(k => k.toLowerCase())

      hints.forEach(el => {
        const hint = el as HTMLElement
        const seq = (hint.dataset.seq || '').split(',')

        // Vérifier si le tampon actuel correspond au début de la séquence de ce hint
        const matches = buffer.every((k, i) => seq[i] === k)

        if (!matches) {
          hint.classList.add('dimmed')
          hint.querySelectorAll('.key').forEach(k => k.classList.remove('active'))
        } else {
          hint.classList.remove('dimmed')
          const keys = hint.querySelectorAll('.key:not(.is-mod)')
          keys.forEach((k, i) => {
            if (i < buffer.length) k.classList.add('active')
            else k.classList.remove('active')
          })
        }
      })
    })
  }

  // Synchronisation de la classe CSS du body avec l'état du mode Alt
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

  return {
    updateVisualHints
  }
}
