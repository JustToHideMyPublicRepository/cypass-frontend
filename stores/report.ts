import { defineStore } from 'pinia'
import type { ReportEntry } from '../types/profil'

export const useReportStore = defineStore('report', {
  state: () => ({
    sentReports: [] as ReportEntry[],
    receivedReports: [] as ReportEntry[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchSentReports() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/profile/reports_sent')
        if (response.success) {
          this.sentReports = response.data
        } else {
          this.error = response.message || 'Impossible de charger les signalements envoyés'
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
        const response: any = await $fetch('/api/profile/reports_received')
        if (response.success) {
          this.receivedReports = response.data
        } else {
          this.error = response.message || 'Impossible de charger les signalements reçus'
        }
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Erreur réseau'
      } finally {
        this.loading = false
      }
    },

    async fetchReportDetails(id: string) {
      try {
        const response: any = await $fetch(`/api/profile/report_details`, {
          params: { id }
        })
        return response.success ? response.data : null
      } catch (err) {
        return null
      }
    }
  }
})
