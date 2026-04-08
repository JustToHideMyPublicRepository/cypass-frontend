import { defineStore } from 'pinia'
import { type LogEntry, type LogStatistics, type ProfilState } from '~/types/profil'

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    profile: null,
    statistics: null,
    logs: [],
    logStatistics: null,
    logUser: null,
    logFilters: null,
    currentLog: null,
    loading: false,
    error: null,
    message: null,
    isLogoutModalOpen: false,
    newsletterLoading: false
  } as ProfilState),

  actions: {
    // Récupérer les logs
    async getUserLogs(params: { limit?: number; type?: string; date?: string } = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{
          success: boolean;
          data: {
            logs: LogEntry[];
            statistics: LogStatistics;
            user: { id: string; email: string; role: string };
            filters: { date: string; type: string; limit: number };
          }
        }>('/api/user/activities/logs-list', {
          params
        })
        if (response.success) {
          this.logs = response.data.logs
          this.logStatistics = response.data.statistics
          this.logUser = response.data.user
          this.logFilters = response.data.filters
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération des logs'
        return false
      } finally {
        this.loading = false
      }
    },

    // Récupérer un log spécifique
    async getUserLogById(id: string) {
      this.loading = true
      this.error = null
      this.currentLog = null
      try {
        const response = await $fetch<{ success: boolean; data: { log: LogEntry }; message: string }>(`/api/user/activities/log-get?id=${id}`, {
          method: 'GET'
        })
        if (response.success && response.data?.log) {
          this.currentLog = response.data.log
          return response.data.log
        }
        this.error = response.message || 'Journal introuvable'
        return null
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération du journal'
        return null
      } finally {
        this.loading = false
      }
    },

    // Récupérer les logs par période
    async getUserLogsPeriod(params: { start_date?: string; end_date?: string; limit?: number; type?: string } = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{
          success: boolean;
          data: {
            logs: LogEntry[];
            statistics: LogStatistics;
            user: { id: string; email: string; role: string };
            filters: any;
          }
        }>('/api/user/activities/logs-period', {
          params
        })
        if (response.success && response.data) {
          this.logs = response.data.logs
          this.logStatistics = response.data.statistics
          this.logUser = response.data.user
          this.logFilters = response.data.filters
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération des logs sur la période'
        return false
      } finally {
        this.loading = false
      }
    },

    // Révoquer une session
    async sessionsDelete(tokenId: string, revokeAll: boolean = false) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/activities/sessions-revoke', {
          method: 'DELETE',
          body: {
            token_id: tokenId,
            revoke_all: revokeAll
          }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de révoquer la session'
        return false
      } finally {
        this.loading = false
      }
    },

    // Récupérer les sessions
    async sessionsGet() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string; data: { sessions: any[] } }>('/api/user/activities/sessions-list', {
          method: 'GET'
        })
        if (response.success) {
          return response.data.sessions
        }
        return []
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de récupérer les sessions'
        return []
      } finally {
        this.loading = false
      }
    },
  }
})
