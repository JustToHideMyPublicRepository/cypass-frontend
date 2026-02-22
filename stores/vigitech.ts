import { defineStore } from 'pinia'
import type { Incident, CreateIncidentRequest } from '../types/vigitech'

export const useVigitechStore = defineStore('vigitech', {
  state: () => ({
    userIncidents: [] as Incident[],
    publicIncidents: [] as Incident[],
    currentIncident: null as Incident | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchUserIncidents() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/vigitech/user/all')
        if (response.success) {
          this.userIncidents = response.data
        } else {
          this.error = response.message || 'Erreur lors de la récupération de vos incidents'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchPublicIncidents(params: any = {}) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/vigitech/all', { params })
        if (response.success) {
          this.publicIncidents = response.data
        } else {
          this.error = response.message || 'Erreur lors de la récupération des incidents publics'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchUserIncidentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch(`/api/vigitech/user/${id}`)
        if (response.success) {
          this.currentIncident = response.data
        } else {
          this.error = response.message || 'Incident non trouvé'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchPublicIncidentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch(`/api/vigitech/${id}`)
        if (response.success) {
          this.currentIncident = response.data
        } else {
          this.error = response.message || 'Incident non trouvé'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async createIncident(payload: CreateIncidentRequest) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('title', payload.title)
        formData.append('description', payload.description)
        formData.append('type', payload.type)
        formData.append('threat_level', payload.threat_level)
        formData.append('is_anonymous', payload.is_anonymous ? 'true' : 'false')
        formData.append('location', payload.location)
        if (payload.evidence) {
          formData.append('evidence', payload.evidence)
        }

        const response: any = await $fetch('/api/vigitech/create', {
          method: 'POST',
          body: formData
        })

        if (response.success) {
          await this.fetchUserIncidents()
          return response.data
        } else {
          this.error = response.message || 'Erreur lors du signalement'
          return null
        }
      } catch (err: any) {
        this.error = err.data?.message || err.message
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
