import { defineStore } from 'pinia'
import type { ReportEntry } from '~/types/profil'

export const useReportIncidentStore = defineStore('reportIncident', {
  state: () => ({
    sentReportsList: [] as ReportEntry[],
    receivedReportsList: [] as ReportEntry[],
    loading: false,
    error: null as string | null,
    message: null as string | null
  }),

  actions: {
    // Récupérer les détails d'un signalement reçu
    async getReceivedReport(id: string) {
      try {
        const response: any = await $fetch('/api/user/report-incident/get-received', {
          params: { id }
        })
        return response.success ? response.data : null
      } catch (err) {
        return null
      }
    },

    // Récupérer les détails d'un signalement envoyé
    async getSentReport(id: string) {
      try {
        const response: any = await $fetch('/api/user/report-incident/get-sent', {
          params: { id }
        })
        return response.success ? response.data : null
      } catch (err) {
        return null
      }
    },

    // Récupérer les signalements reçus
    async receivedReports() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/report-incident/list-received')
        if (response.success) {
          this.receivedReportsList = response.data
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de charger les signalements'
        return false
      } finally {
        this.loading = false
      }
    },

    // Récupérer les signalements envoyés
    async sentReports() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/report-incident/list-sent')
        if (response.success) {
          this.sentReportsList = response.data
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de charger les signalements'
        return false
      } finally {
        this.loading = false
      }
    },

    // Signaler un incident
    async reportIncident(incidentId: string, reason: string, details: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/report-incident/report', {
          method: 'POST',
          body: { incident_id: incidentId, reason, details }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de l\'envoi du signalement'
        return false
      } finally {
        this.loading = false
      }
    },
  }
})
