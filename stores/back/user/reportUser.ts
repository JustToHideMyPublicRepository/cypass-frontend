import { defineStore } from 'pinia'
import type { ReportEntry } from '~/types/profil'

export const useReportUserStore = defineStore('reportUser', {
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
        const response: any = await $fetch('/api/user/report-user/get-received', {
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
        const response: any = await $fetch('/api/user/report-user/get-sent', {
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
        const response: any = await $fetch('/api/user/report-user/list-received', {
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
        const response: any = await $fetch('/api/user/report-user/list-sent', {
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

    // Signaler un utilisateur
    async reportUser(targetId: string, reason: string, details: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/report-user/report', {
          method: 'POST',
          body: { reported_user_id: targetId, reason, details }
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
