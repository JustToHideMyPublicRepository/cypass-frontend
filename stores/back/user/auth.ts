import { defineStore } from 'pinia'
import { type User, type AuthState } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
    error: null,
    message: null,
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
    // Mot de passe oublié
    async forgotPassword(email: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/password-forgot', {
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

    // Connexion
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
        }>('/api/user/auth/login', {
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

    // Inscription
    async register(formData: any) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/register', {
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

    // Renvoyer le code MFA
    async resendMfa() {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/mfa-resend', {
          method: 'POST',
          body: { email: this.mfaSession.email }
        })
        if (response.success) {
          this.message = response.message
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

    // Renvoyer le code de vérification
    async resendVerification(email: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/email-resend', {
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

    // Réinitialiser le mot de passe
    async resetPassword(data: { token: string; password: string; confirm: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/password-reset', {
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

    // Initialiser l'authentification
    async verifyToken() {
      if (this.initialized) return

      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}

        const response = await $fetch<{ success: boolean; data: { user: User } }>('/api/user/auth/token-verify', { headers })
        if (response.success) {
          this.user = response.data.user
        }
      } catch (err) {
        this.user = null
      } finally {
        this.initialized = true
      }
    },

    // Vérifier l'email
    async verifyEmail(token: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/email-verify', {
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

    // Vérifier le code MFA
    async verifyMfa(code: string) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{
          success: boolean;
          message: string;
          data: { user: User; token: string }
        }>('/api/user/auth/mfa-verify', {
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
  }
})
