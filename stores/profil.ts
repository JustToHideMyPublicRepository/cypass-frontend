import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  organization_name: string | null
  avatar_url: string | null
  role: string
  status: 'pending' | 'active' | 'pending_delete' | 'deleted' | 'suspended'
  email_verified: boolean
  created_at: string
}

interface Statistics {
  total_documents: number
  total_incidents: number
}

interface LogEntry {
  id: string
  action: string
  action_label: string
  details: any
  ip_address: string
  user_agent: string
  status: string
  timestamp: string
  log_type: string
}

interface LogStatistics {
  total_logs: number
  by_type: Record<string, number>
  by_action: Record<string, number>
  date_range: string
}

interface ProfilState {
  profile: UserProfile | null
  statistics: Statistics | null
  logs: LogEntry[]
  logStatistics: LogStatistics | null
  logUser: { id: string; email: string; role: string } | null
  logFilters: { date: string; type: string; limit: number } | null
  loading: boolean
  error: string | null
  message: string | null
}

export const useProfilStore = defineStore('profil', {
  state: (): ProfilState => ({
    profile: null,
    statistics: null,
    logs: [],
    logStatistics: null,
    logUser: null,
    logFilters: null,
    loading: false,
    error: null,
    message: null
  }),

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; user: UserProfile; statistics: Statistics }>('/api/profile')
        if (response.success) {
          this.profile = response.user
          this.statistics = response.statistics
          return true
        }
        this.error = 'Impossible de récupérer le profil'
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la récupération du profil'
        return false
      } finally {
        this.loading = false
      }
    },

    async updateEmail(newEmail: string, currentPassword: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/email', {
          method: 'PUT',
          body: { new_email: newEmail, current_password: currentPassword }
        })
        if (response.success) {
          this.message = response.message
          // Profile needs refresh to show "pending" status badge
          await this.fetchProfile()
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue'
        return false
      } finally {
        this.loading = false
      }
    },

    async updatePassword(current: string, newPass: string, confirm: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/password', {
          method: 'PUT',
          body: {
            current_password: current,
            new_password: newPass,
            confirm_password: confirm
          }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue'
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchLogs(params: { limit?: number; type?: string; date?: string } = {}) {
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
        }>('/api/profile/logs', {
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

    async uploadAvatar(file: File) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await $fetch<{ success: boolean; data: { avatar_url: string }; message: string }>('/api/profile/avatar', {
          method: 'POST',
          body: formData
        })
        if (response.success) {
          this.message = response.message
          if (this.profile) {
            this.profile.avatar_url = response.data.avatar_url
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de l’upload de l’avatar'
        return false
      } finally {
        this.loading = false
      }
    },
    async deleteAvatar() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/avatar', {
          method: 'POST',
          body: { action: 'delete' }
        })
        if (response.success) {
          this.message = response.message
          if (this.profile) {
            this.profile.avatar_url = null
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la suppression de l’avatar'
        return false
      } finally {
        this.loading = false
      }
    },

    async updatePersonalInfo(data: { first_name?: string; last_name?: string; organization_name?: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/update', {
          method: 'PUT',
          body: data
        })
        if (response.success) {
          this.message = response.message
          await this.fetchProfile() // Refresh local data

          // Sync with AuthStore
          const authStore = useAuthStore()
          if (authStore.user) {
            if (data.first_name) authStore.user.first_name = data.first_name
            if (data.last_name) authStore.user.last_name = data.last_name
            if (data.organization_name) authStore.user.organization = data.organization_name
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la mise à jour des informations'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
