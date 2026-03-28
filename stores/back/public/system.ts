import { defineStore } from 'pinia'
import type { SystemComponent, SystemIncident } from '~/types/status'

export const useSystemStore = defineStore('system', {
  state: () => ({
    components: [] as SystemComponent[],
    hystory: [] as SystemIncident[],
    loadingComponents: false,
    loadingHystory: false,
    currentPeriod: 'week',
    lastUpdate: null as string | null,
    error: null as string | null
  }),

  actions: {
    // Récupérer le statut du système
    async fetchSystemStatus() {
      this.components = []
      this.lastUpdate = null
      this.loadingComponents = true
      this.error = null
      try {
        const res = await $fetch<any>('/api/public/system/status')
        if (res?.success && res.data?.components) {
          this.components = res.data.components
          this.lastUpdate = new Date().toLocaleTimeString('fr-FR')
        } else {
          this.components = []
        }
      } catch (err: any) {
        this.error = err.message || 'Erreur API Status'
      } finally {
        this.loadingComponents = false
      }
    },

    // Récupérer l'historique du système
    async fetchSystemHystory(period?: string) {
      if (period) this.currentPeriod = period
      this.hystory = []
      this.loadingHystory = true
      this.error = null
      try {
        const res = await $fetch<any>('/api/public/system/history', {
          params: { period: this.currentPeriod }
        })
        if (res?.success && res.data?.hystory) {
          this.hystory = res.data.hystory
        } else {
          this.hystory = []
        }
      } catch (err: any) {
        this.error = err.message || 'Erreur lors de la récupération de l\'historique'
      } finally {
        this.loadingHystory = false
      }
    }
  }
})
