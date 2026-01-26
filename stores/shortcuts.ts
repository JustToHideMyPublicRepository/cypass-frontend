import { defineStore } from 'pinia'

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
}

export const useShortcutsStore = defineStore('shortcuts', {
  state: (): ShortcutSettings => ({
    enabled: true,
    showHover: true,
    showAlt: true,
    showButtonHints: true,
    sortBy: 'name',
    groupSort: 'az',
    isHelpOpen: false,
    altMode: false,
    buffer: []
  }),

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
    },

    toggleSetting(key: keyof Omit<ShortcutSettings, 'sortBy' | 'groupSort' | 'isHelpOpen' | 'altMode' | 'buffer'>) {
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
    }
  }
})
