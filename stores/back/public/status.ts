import { defineStore } from 'pinia'
import type { SystemComponent, SystemIncident } from '~/types/status'

export const useStatusStore = defineStore('status', {
  state: () => ({
    components: [] as SystemComponent[],
    incidents: [] as SystemIncident[],
    loadingComponents: false,
    loadingIncidents: false,
    currentPeriod: 'week',
    lastUpdate: null as string | null,
    error: null as string | null
  }),

  actions: {
    async fetchSystemStatus() {
      this.components = []
      this.lastUpdate = null
      this.loadingComponents = true
      this.error = null
      try {
        const res = await $fetch<any>('/api/public/state/status')
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
    async fetchIncidents(period?: string) {
      if (period) this.currentPeriod = period
      this.incidents = []
      this.loadingIncidents = true
      this.error = null
      try {
        const res = await $fetch<any>('/api/public/state/incidents', {
          params: { period: this.currentPeriod }
        })
        if (res?.success && res.data?.incidents) {
          this.incidents = res.data.incidents
        } else {
          this.incidents = []
        }
      } catch (err: any) {
        this.error = err.message || 'Erreur lors de la récupération des incidents'
      } finally {
        this.loadingIncidents = false
      }
    }
  }
})
