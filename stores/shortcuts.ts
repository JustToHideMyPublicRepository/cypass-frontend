import { defineStore } from 'pinia'

interface ShortcutSettings {
  enabled: boolean
  showHover: boolean
  showAlt: boolean
  sortBy: 'name' | 'key'
  isHelpOpen: boolean
}

export const useShortcutsStore = defineStore('shortcuts', {
  state: (): ShortcutSettings => ({
    enabled: true,
    showHover: true,
    showAlt: true,
    sortBy: 'name',
    isHelpOpen: false
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
      localStorage.setItem('cps_shortcuts', JSON.stringify(this.$state))
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

    toggleSetting(key: keyof Omit<ShortcutSettings, 'sortBy' | 'isHelpOpen'>) {
      this[key] = !this[key]
      this.save()
    },

    toggleHelp() {
      this.isHelpOpen = !this.isHelpOpen
    }
  }
})
