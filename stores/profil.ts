import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { type UserProfile, type Statistics, type LogEntry, type LogStatistics, type ProfilState } from '../types/profil'

export const useProfilStore = defineStore('profil', {
  state: () => ({
    profile: null,
    statistics: null,
    logs: [],
    logStatistics: null,
    logUser: null,
    logFilters: null,
    loading: false,
    error: null,
    message: null
  } as ProfilState),

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response = await $fetch<{ success: boolean; user: UserProfile; statistics: Statistics }>('/api/profile', { headers })
        if (response.success) {
          this.profile = response.user
          this.statistics = response.statistics
          this.syncAuthAvatar(response.user.avatar_url)
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

    async fetchLogsRange(dates: string[], limit: number = 500) {
      this.loading = true
      this.error = null
      try {
        const fetchPromises = dates.map(date =>
          $fetch<any>('/api/profile/logs', { params: { limit, date, type: 'all' } })
        )
        const results = await Promise.all(fetchPromises)
        let allLogs: LogEntry[] = []
        results.forEach(res => {
          if (res.success && res.data?.logs) {
            allLogs = [...allLogs, ...res.data.logs]
          }
        })
        // Unique by ID to avoid duplicates if any
        this.logs = allLogs.filter((log, index, self) =>
          index === self.findIndex((t) => t.id === log.id)
        )
        return true
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération de la plage de logs'
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
          this.syncAuthAvatar(response.data.avatar_url)
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
          this.syncAuthAvatar(null)
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
    },

    async deleteAccount(password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/delete', {
          method: 'DELETE',
          body: {
            confirm: true,
            current_password: password
          }
        })
        if (response.success) {
          this.message = response.message
          const authStore = useAuthStore()
          await authStore.logout() // Force logout after deletion request
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la suppression du compte'
        return false
      } finally {
        this.loading = false
      }
    },

    syncAuthAvatar(url: string | null) {
      const authStore = useAuthStore()
      if (authStore.user) {
        authStore.user.avatar_url = url
      }
    },
    async toggleMfa(enabled: boolean) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: { mfa_enabled: boolean }; message: string }>('/api/profile/mfa', {
          method: 'PATCH',
          body: { mfa_enabled: enabled }
        })

        if (response.success) {
          this.message = response.message
          if (this.profile) {
            this.profile.mfa_enabled = response.data.mfa_enabled
          }
          const authStore = useAuthStore()
          if (authStore.user) {
            authStore.user.mfa_enabled = response.data.mfa_enabled
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors du changement du MFA'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
