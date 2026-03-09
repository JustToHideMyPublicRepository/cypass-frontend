import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { type UserProfile, type Statistics, type LogEntry, type LogStatistics, type ProfilState } from '~/types/profil'

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
    message: null,
    isLogoutModalOpen: false
  } as ProfilState),

  actions: {
    // Mise à jour d'email
    async changeEmail(newEmail: string, currentPassword: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/change-email', {
          method: 'PUT',
          body: { new_email: newEmail, current_password: currentPassword }
        })
        if (response.success) {
          this.message = response.message
          // Profile needs refresh to show "pending" status badge
          await this.getProfile()
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

    // Mise à jour de mot de passe
    async changePassword(current: string, newPass: string, confirm: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/change-password', {
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

    // Supression de compte
    async deleteAccount(password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/delete-account', {
          method: 'DELETE',
          body: {
            confirm: true,
            current_password: password
          }
        })
        if (response.success) {
          this.message = response.message
          await this.logout()
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

    // Récupérer le profil
    async getProfile() {
      this.loading = true
      this.error = null
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response = await $fetch<{ success: boolean; user: UserProfile; statistics: Statistics }>('/api/user/profile/get-profile', { headers })
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
        }>('/api/user/profile/get-user-logs', {
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

    // Récupérer les logs par plage de dates
    async getUserLogsRange(dates: string[], limit: number = 500) {
      this.loading = true
      this.error = null
      try {
        const fetchPromises = dates.map(date =>
          $fetch<any>('/api/user/profile/get-user-logs', { params: { limit, date, type: 'all' } })
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

    // Déconnexion
    async logout(shouldRedirect: boolean = true) {
      try {
        await $fetch('/api/user/profile/logout', { method: 'POST' })
      } finally {
        const authStore = useAuthStore()
        authStore.user = null
        if (shouldRedirect) {
          navigateTo('/auth/login')
        }
      }
    },

    // Révoquer une session
    async sessionsDelete(tokenId: string, revokeAll: boolean = false) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/sessions', {
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
        const response = await $fetch<{ success: boolean; message: string; data: { sessions: any[] } }>('/api/user/profile/sessions', {
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

    // Activer/Désactiver le MFA
    async toggleMfa(enabled: boolean) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: { mfa_enabled: boolean }; message: string }>('/api/user/profile/toggle-mfa', {
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
    },

    // Mise à jour des informations personnelles
    async updateProfile(data: { first_name?: string; last_name?: string; organization_name?: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/update-profile', {
          method: 'PUT',
          body: data
        })
        if (response.success) {
          this.message = response.message
          await this.getProfile() // Refresh local data

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

    // Changement d'avatar
    async uploadAvatarSet(file: File) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await $fetch<{ success: boolean; data: { avatar_url: string }; message: string }>('/api/user/profile/upload-avatar', {
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

    // Suppression d'avatar
    async uploadAvatarDelete() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/upload-avatar', {
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

    // Gestion des modaux de déconnexion
    openLogoutModal() {
      this.isLogoutModalOpen = true
    },

    closeLogoutModal() {
      this.isLogoutModalOpen = false
    },

    // Synchronisation de l'avatar avec AuthStore
    syncAuthAvatar(url: string | null) {
      const authStore = useAuthStore()
      if (authStore.user) {
        authStore.user.avatar_url = url
      }
    },
  }
})
