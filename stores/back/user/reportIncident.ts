import { defineStore } from 'pinia'
import type { ReportEntry } from '~/types/profil'

export const useReportIncidentStore = defineStore('reportIncident', {
  state: () => ({
    sentReportsList: [] as ReportEntry[],
    receivedReportsList: [] as ReportEntry[],
    sentPagination: {
      total: 0,
      limit: 10,
      offset: 0,
      hasMore: true
    },
    receivedPagination: {
      total: 0,
      limit: 10,
      offset: 0,
      hasMore: true
    },
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
    async receivedReports(append = false) {
      if (!append) {
        this.receivedPagination.offset = 0
        this.receivedPagination.hasMore = true
      }
      this.loading = true
      this.error = null
      try {
        const limit = this.receivedPagination.limit
        const offset = this.receivedPagination.offset
        const response: any = await $fetch('/api/user/report-incident/list-received', {
          params: { limit, offset }
        })
        if (response.success) {
          const data = response.data || []
          if (append) {
            this.receivedReportsList = [...this.receivedReportsList, ...data]
          } else {
            this.receivedReportsList = data
          }

          const totalReceived = data.length
          const totalFromBackend = response.total || 0
          const currentTotalCount = this.receivedReportsList.length

          this.receivedPagination.offset = append ? this.receivedPagination.offset + totalReceived : totalReceived
          this.receivedPagination.total = totalFromBackend || currentTotalCount
          this.receivedPagination.hasMore = totalFromBackend > 0 ? (currentTotalCount < totalFromBackend) : (totalReceived >= limit)
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
    async sentReports(append = false) {
      if (!append) {
        this.sentPagination.offset = 0
        this.sentPagination.hasMore = true
      }
      this.loading = true
      this.error = null
      try {
        const limit = this.sentPagination.limit
        const offset = this.sentPagination.offset
        const response: any = await $fetch('/api/user/report-incident/list-sent', {
          params: { limit, offset }
        })
        if (response.success) {
          const data = response.data || []
          if (append) {
            this.sentReportsList = [...this.sentReportsList, ...data]
          } else {
            this.sentReportsList = data
          }

          const totalReceived = data.length
          const totalFromBackend = response.total || 0
          const currentTotalCount = this.sentReportsList.length

          this.sentPagination.offset = append ? this.sentPagination.offset + totalReceived : totalReceived
          this.sentPagination.total = totalFromBackend || currentTotalCount
          this.sentPagination.hasMore = totalFromBackend > 0 ? (currentTotalCount < totalFromBackend) : (totalReceived >= limit)
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

    // Mettre à jour un signalement
    async updateReport(reportId: string, reason: string, details: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/report-incident/update-sent', {
          method: 'PUT',
          body: { report_id: reportId, reason, details }
        })
        if (response.success) {
          this.message = response.message
          // Update local list
          const idx = this.sentReportsList.findIndex(r => r.id === reportId)
          if (idx !== -1) {
            this.sentReportsList[idx] = { ...this.sentReportsList[idx], reason, details }
          }
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la mise à jour'
        return false
      } finally {
        this.loading = false
      }
    },

    // Supprimer un signalement
    async deleteReport(reportId: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/report-incident/delete-sent', {
          method: 'DELETE',
          body: { report_id: reportId }
        })
        if (response.success) {
          this.message = response.message
          this.sentReportsList = this.sentReportsList.filter(r => r.id !== reportId)
          this.sentPagination.total = Math.max(0, this.sentPagination.total - 1)
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la suppression'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
