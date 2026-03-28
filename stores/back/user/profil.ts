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
    currentLog: null,
    loading: false,
    error: null,
    message: null,
    isLogoutModalOpen: false
  } as ProfilState),

  actions: {
    // Récupérer le profil
    async getProfile() {
      this.loading = true
      this.error = null
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response = await $fetch<{ success: boolean; user: UserProfile; statistics: Statistics }>('/api/user/profile/me', { headers })
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

    // Mise à jour des informations personnelles
    async updateProfile(data: { first_name?: string; last_name?: string; organization_name?: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/update', {
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

        const response = await $fetch<{ success: boolean; data: { avatar_url: string }; message: string }>('/api/user/profile/change-avatar', {
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
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/profile/change-avatar', {
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
