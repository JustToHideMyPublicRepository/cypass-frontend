import { defineStore } from 'pinia'
import { shortcutsData } from '@/data/shortcuts'

interface ShortcutSettings {
  enabled: boolean
  showHover: boolean
  showAlt: boolean
  showButtonHints: boolean
  sortBy: 'name' | 'key'
  groupSort: 'az' | 'za' | 'more' | 'less'
  isHelpOpen: boolean
  altMode: boolean
  buffer: string[]
  customShortcuts: Record<string, { keys: string[], modifier?: string }>
}

export const useShortcutsStore = defineStore('shortcuts', {
  state: (): ShortcutSettings => ({
    enabled: true,
    showHover: false,
    showAlt: true,
    showButtonHints: true,
    sortBy: 'name',
    groupSort: 'az',
    isHelpOpen: false,
    altMode: false,
    buffer: [],
    customShortcuts: {}
  }),

  getters: {
    /**
     * Fusionne les raccourcis par défaut avec les personnalisations utilisateur
     */
    mergedShortcuts: (state) => {
      const merged = { ...shortcutsData }
      Object.entries(state.customShortcuts).forEach(([id, custom]) => {
        if (merged[id]) {
          merged[id] = {
            ...merged[id],
            keys: custom.keys,
            modifier: custom.modifier
          }
        }
      })
      return merged
    }
  },

  actions: {
    init() {
      if (import.meta.server) return

      const saved = localStorage.getItem('cps_shortcuts')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          this.$patch(parsed)
        } catch (e) {
          console.error('Failed to parse shortcuts settings', e)
        }
      }

      this.updateBodyClasses()
    },

    save() {
      if (import.meta.server) return
      const { isHelpOpen, ...toSave } = this.$state
      localStorage.setItem('cps_shortcuts', JSON.stringify(toSave))
      this.updateBodyClasses()
    },

    updateBodyClasses() {
      if (import.meta.server) return

      const body = document.body

      // Update data attributes or classes for CSS targeting
      if (this.showHover) body.classList.add('shortcuts-hover-enabled')
      else body.classList.remove('shortcuts-hover-enabled')

      if (this.showAlt) body.classList.add('shortcuts-alt-enabled')
      else body.classList.remove('shortcuts-alt-enabled')

      if (this.showButtonHints) body.classList.add('shortcuts-button-hints-enabled')
      else body.classList.remove('shortcuts-button-hints-enabled')
    },

    toggleSetting(key: keyof Omit<ShortcutSettings, 'sortBy' | 'groupSort' | 'isHelpOpen' | 'altMode' | 'buffer' | 'customShortcuts'>) {
      this[key] = !this[key]
      this.save()
    },

    toggleHelp() {
      this.isHelpOpen = !this.isHelpOpen
    },

    openHelp() {
      this.isHelpOpen = true
    },

    toggleAltMode() {
      this.altMode = !this.altMode
      if (!this.altMode) this.buffer = []
    },

    disableAltMode() {
      this.altMode = false
      this.buffer = []
    },

    addToBuffer(key: string) {
      this.buffer.push(key)
    },

    clearBuffer() {
      this.buffer = []
    },

    resetSettings() {
      this.enabled = true
      this.showHover = false
      this.showAlt = true
      this.showButtonHints = true
      this.sortBy = 'name'
      this.groupSort = 'az'
      this.altMode = false
      this.buffer = []
      this.customShortcuts = {}

      this.save()
    },

    /**
     * Met à jour un raccourci spécifique
     */
    updateShortcut(id: string, keys: string[], modifier?: string) {
      this.customShortcuts[id] = { keys, modifier }
      this.save()
    },

    /**
     * Réinitialise un raccourci spécifique vers sa valeur par défaut
     */
    resetShortcut(id: string) {
      delete this.customShortcuts[id]
      this.save()
    },

    /**
     * Réinitialise tous les raccourcis vers leurs valeurs par défaut
     */
    resetAllShortcuts() {
      this.customShortcuts = {}
      this.save()
    },

    /**
     * Exporte la configuration actuelle en JSON
     */
    exportConfig() {
      if (import.meta.server) return
      const config = JSON.stringify({
        customShortcuts: this.customShortcuts,
        settings: {
          enabled: this.enabled,
          showHover: this.showHover,
          showAlt: this.showAlt,
          showButtonHints: this.showButtonHints
        }
      }, null, 2)

      const blob = new Blob([config], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cypass-shortcuts-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    },

    /**
     * Importe une configuration depuis un JSON
     */
    importConfig(json: string) {
      try {
        const parsed = JSON.parse(json)
        if (parsed.customShortcuts) {
          this.customShortcuts = parsed.customShortcuts
        }
        if (parsed.settings) {
          Object.assign(this.$state, parsed.settings)
        }
        this.save()
        return true
      } catch (e) {
        console.error('Failed to import shortcuts config', e)
        return false
      }
    }
  }
})
