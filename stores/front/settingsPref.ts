import { defineStore } from 'pinia'

export const useSettingsPrefStore = defineStore('settingsPref', {
  state: () => ({
    display: {
      appearance: true,
      notifications: true,
      shortcuts: true,
      vigitech: true,
      region: true,
      newsletter: true
    }
  }),

  actions: {
    toggleSection(key: keyof typeof this.display) {
      if (typeof this.display[key] === 'boolean') {
        this.display[key] = !this.display[key]
        this.saveToLocalStorage()
      }
    },

    setAll(value: boolean) {
      this.display.appearance = value
      this.display.notifications = value
      this.display.shortcuts = value
      this.display.vigitech = value
      this.display.region = value
      this.display.newsletter = value
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cps_settings_collapse', JSON.stringify(this.display))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('cps_settings_collapse')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            // Ne charger que les clés existantes pour éviter des erreurs
            if (typeof parsed === 'object') {
              Object.keys(this.display).forEach((key) => {
                const typedKey = key as keyof typeof this.display
                if (typeof parsed[typedKey] === 'boolean') {
                  this.display[typedKey] = parsed[typedKey]
                }
              })
            }
          } catch (e) {
            console.error('Failed to parse settings display preferences', e)
          }
        }
      }
    }
  }
})
