import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useProfilStore } from './profil'
import { type ProfilState } from '~/types/profil'

export const useSecurityStore = defineStore('security', {
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
    // Mise à jour d'email
    async changeEmail(newEmail: string, currentPassword: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/security/change-email', {
          method: 'PUT',
          body: { new_email: newEmail, current_password: currentPassword }
        })
        if (response.success) {
          this.message = response.message
          // Profile needs refresh to show "pending" status badge
          await useProfilStore().getProfile()
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
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/security/change-password', {
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
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/security/delete-account', {
          method: 'DELETE',
          body: {
            confirm: true,
            current_password: password
          }
        })
        if (response.success) {
          this.message = response.message
          await useProfilStore().logout()
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

    // Activer/Désactiver le MFA
    async toggleMfa(enabled: boolean) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: { mfa_enabled: boolean }; message: string }>('/api/user/security/toggle-mfa', {
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
