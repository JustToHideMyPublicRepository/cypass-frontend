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
    async toggleMfa(enabled: boolean, days?: number) {
      this.loading = true
      this.error = null
      try {
        const body: any = { mfa_enabled: enabled }
        if (!enabled && days) {
          body.disable_days = days
        }

        const response = await $fetch<{ success: boolean; data: { mfa_enabled: boolean; mfa_active?: boolean; mfa_disabled_until?: string | null }; message: string }>('/api/user/security/mfa-toggle', {
          method: 'PATCH',
          body
        })

        if (response.success) {
          this.message = response.message

          const profilStore = useProfilStore()
          await profilStore.getProfile()

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

    // Récupérer les codes de sécurité
    async getSecurityCodes(password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: { codes: string[]; remaining_count: number; expires_at: string }; message: string }>('/api/user/security/mfaMtd-sec-codes', {
          method: 'POST',
          body: { password }
        })
        if (response.success) {
          return response.data
        }
        this.error = response.message
        return null
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération des codes'
        return null
      } finally {
        this.loading = false
      }
    },

    // Réinitialiser les codes de sécurité
    async resetSecurityCodes() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: { codes: string[]; expires_at: string }; message: string }>('/api/user/security/mfaMtd-sec-reset', {
          method: 'POST'
        })
        if (response.success) {
          // Refresh profile to update has_security_codes
          await useProfilStore().getProfile()
          return response.data
        }
        this.error = response.message
        return null
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la réinitialisation des codes'
        return null
      } finally {
        this.loading = false
      }
    },

    // Définir la méthode MFA par défaut
    async setDefaultMfaMethod(method: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/security/mfa-default-method', {
          method: 'PATCH',
          body: { method }
        })
        if (response.success) {
          this.message = response.message
          await useProfilStore().getProfile()
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la mise à jour'
        return false
      } finally {
        this.loading = false
      }
    },

    // Initialiser la configuration Authenticator
    async authenticatorSetup() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: { secret: string; qr_code_url: string; qr_code_inline: string }; message: string }>('/api/user/security/mfaMtd-auth-setup', {
          method: 'POST'
        })
        if (response.success) {
          return response.data
        }
        this.error = response.message
        return null
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de l\'initialisation'
        return null
      } finally {
        this.loading = false
      }
    },

    // Confirmer la configuration Authenticator
    async authenticatorConfirm(code: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/security/mfaMtd-auth-confirm', {
          method: 'POST',
          body: { code }
        })
        if (response.success) {
          await useProfilStore().getProfile()
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Le code est invalide'
        return false
      } finally {
        this.loading = false
      }
    },

    // Récupérer les options Passkey
    async getPasskeyOptions() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/security/passkey-options')
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération des options'
        return null
      } finally {
        this.loading = false
      }
    },

    // Enregistrer la Passkey
    async registerPasskey(data: any) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/security/passkey-register', {
          method: 'POST',
          body: data
        })
        await useProfilStore().getProfile()
        return response || { success: true }
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de l\'enregistrement'
        return null
      } finally {
        this.loading = false
      }
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
