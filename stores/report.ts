import { defineStore } from 'pinia'
import type { ReportEntry } from '../types/profil'

export const useReportStore = defineStore('report', {
  state: () => ({
    reportType: 'user' as 'user' | 'incident',
    sentReports: [] as ReportEntry[],
    receivedReports: [] as ReportEntry[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    setReportType(type: 'user' | 'incident') {
      this.reportType = type
      this.sentReports = []
      this.receivedReports = []
    },

    async fetchSentReports() {
      this.loading = true
      this.error = null
      try {
        const endpoint = this.reportType === 'user'
          ? '/api/profile/reports_sent'
          : '/api/profile/reports_incident_sent'

        const response: any = await $fetch(endpoint)
        if (response.success) {
          this.sentReports = response.data
        } else {
          this.error = response.message || 'Impossible de charger les signalements'
        }
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Erreur réseau'
      } finally {
        this.loading = false
      }
    },

    async fetchReceivedReports() {
      this.loading = true
      this.error = null
      try {
        const endpoint = this.reportType === 'user'
          ? '/api/profile/reports_received'
          : '/api/profile/reports_incident_received'

        const response: any = await $fetch(endpoint)
        if (response.success) {
          this.receivedReports = response.data
        } else {
          this.error = response.message || 'Impossible de charger les signalements'
        }
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Erreur réseau'
      } finally {
        this.loading = false
      }
    },

    async fetchReportDetails(id: string) {
      try {
        const endpoint = this.reportType === 'user'
          ? `/api/profile/report_details`
          : `/api/profile/report_incident_details`

        const response: any = await $fetch(endpoint, {
          params: { id }
        })
        return response.success ? response.data : null
      } catch (err) {
        return null
      }
    },

    async updateIncidentReport(reportId: string, reason: string, details: string) {
      try {
        const response: any = await $fetch('/api/profile/report_incident_update', {
          method: 'PUT',
          body: { report_id: reportId, reason, details }
        })
        if (response.success) {
          // Update local state if needed (e.g., refresh list)
          await this.fetchSentReports()
        }
        return response
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la mise à jour' }
      }
    },

    async deleteIncidentReport(reportId: string) {
      try {
        const response: any = await $fetch('/api/profile/report_incident_delete', {
          method: 'DELETE',
          body: { report_id: reportId }
        })
        if (response.success) {
          this.sentReports = this.sentReports.filter(r => r.id !== reportId)
        }
        return response
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la suppression' }
      }
    }
  }
})
