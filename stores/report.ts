import { defineStore } from 'pinia'
import type { ReportEntry } from '../types/profil'

export const useReportStore = defineStore('report', {
  state: () => ({
    reportType: 'user' as 'user' | 'incident',
    sentReportsList: [] as ReportEntry[],
    receivedReportsList: [] as ReportEntry[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    setReportType(type: 'user' | 'incident') {
      this.reportType = type
      this.sentReportsList = []
      this.receivedReportsList = []
    },

    async sentReports() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/profile/reports_incident_sent')
        if (response.success) {
          this.sentReportsList = response.data
        } else {
          this.error = response.message || 'Impossible de charger les signalements'
        }
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Erreur réseau'
      } finally {
        this.loading = false
      }
    },

    async receivedReports() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/profile/reports_incident_received')
        if (response.success) {
          this.receivedReportsList = response.data
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
        const response: any = await $fetch('/api/profile/report_incident_details', {
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
          await this.sentReports()
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
          this.sentReportsList = this.sentReportsList.filter(r => r.id !== reportId)
        }
        return response
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la suppression' }
      }
    }
  }
})
