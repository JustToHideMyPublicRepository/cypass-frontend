import { defineStore } from 'pinia'
import { type User, type AuthState } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
    error: null,
    message: null,
    isLogoutModalOpen: false,
    mfaSession: null
  } as AuthState),

  getters: {
    fullName: (state) => {
      if (!state.user) return 'Vous'
      return `${state.user.first_name} ${state.user.last_name}`.trim() || 'Vous'
    },
    avatarUrl: (state) => {
      const user = state.user
      return getUserAvatarUrl(
        user?.avatar_url,
        user?.first_name,
        user?.last_name
      )
    }
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{
          success: boolean;
          message: string;
          data: {
            user?: User;
            token?: string;
            require_mfa?: boolean;
            email?: string;
          }
        }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (response.success) {
          if (response.data.require_mfa) {
            this.mfaSession = {
              email: response.data.email || credentials.email,
              loginTime: Date.now()
            }
            this.message = response.message
            return { requireMfa: true }
          }

          this.user = response.data.user!
          this.message = response.message
          return { success: true }
        }
        this.error = response.message
        return { success: false }
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la connexion'
        return { success: false }
      } finally {
        this.loading = false
      }
    },

    async verifyMfa(code: string) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{
          success: boolean;
          message: string;
          data: { user: User; token: string }
        }>('/api/auth/verify-mfa', {
          method: 'POST',
          body: {
            email: this.mfaSession.email,
            code
          }
        })
        if (response.success) {
          this.user = response.data.user
          this.message = response.message
          this.mfaSession = null
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Code invalide ou expiré'
        return false
      } finally {
        this.loading = false
      }
    },

    async resendMfa() {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/resend-mfa', {
          method: 'POST',
          body: { email: this.mfaSession.email }
        })
        if (response.success) {
          this.message = response.message
          // Refresh login time to reset 10m countdown if needed, 
          // though strictly the 10m is from initial connection according to prompt
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors du renvoi du code'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(formData: any) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/register', {
          method: 'POST',
          body: formData
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || err.data?.errors?.join(', ') || 'Une erreur est survenue lors de l\'inscription'
        return false
      } finally {
        this.loading = false
      }
    },

    async verifyEmail(token: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/verify-email', {
          method: 'GET',
          params: { token }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la vérification'
        return false
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la demande'
        return false
      } finally {
        this.loading = false
      }
    },

    async resendVerification(email: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/resend-verification', {
          method: 'POST',
          body: { email }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de l\'envoi'
        return false
      } finally {
        this.loading = false
      }
    },

    async resetPassword(data: { token: string; password: string; confirm: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/reset-password', {
          method: 'POST',
          body: {
            token: data.token,
            new_password: data.password,
            confirm_password: data.confirm
          }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la réinitialisation'
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchSessions() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string; data: { sessions: any[] } }>('/api/auth/sessions', {
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

    async revokeSession(tokenId: string, revokeAll: boolean = false) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/sessions', {
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

    async logout(shouldRedirect: boolean = true) {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } finally {
        this.user = null
        if (shouldRedirect) {
          navigateTo('/auth/login')
        }
      }
    },

    async initAuth() {
      if (this.initialized) return

      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}

        const response = await $fetch<{ success: boolean; data: { user: User } }>('/api/auth/me', { headers })
        if (response.success) {
          this.user = response.data.user
        }
      } catch (err) {
        this.user = null
      } finally {
        this.initialized = true
      }
    },

    openLogoutModal() {
      this.isLogoutModalOpen = true
    },

    closeLogoutModal() {
      this.isLogoutModalOpen = false
    }
  }
})
