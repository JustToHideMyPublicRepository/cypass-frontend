import { defineStore } from 'pinia'

export const useVigiPrefStore = defineStore('vigiPref', {
  state: () => ({
    display: {
      previewFile: false,
      showComments: true
    }
  }),

  actions: {
    toggleSetting(key: 'previewFile' | 'showComments') {
      this.display[key] = !this.display[key]
      this.saveToLocalStorage()
    },

    resetToDefault() {
      this.display = {
        previewFile: false,
        showComments: true
      }
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cps_vigitetch-preference', JSON.stringify(this.display))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('cps_vigitetch-preference')
        if (saved) {
          try {
            this.display = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse display settings', e)
          }
        }
      }
    }
  }
})
