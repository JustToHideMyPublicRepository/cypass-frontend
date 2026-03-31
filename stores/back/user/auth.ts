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
            mfa_required?: boolean;
            email?: string;
            available_methods?: string[];
            default_method?: string | null;
            mfa_disabled_until?: string | null;
          }
        }>('/api/user/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (response.success) {
          // Détection ultra-robuste du MFA (dans 'data' ou à la racine)
          const mfaRequired = response.data?.mfa_required || (response.data as any)?.require_mfa || (response as any).mfa_required

          if (mfaRequired) {
            const data = response.data || (response as any)
            const rawMethods = data.available_methods || (data as any).methods || ['totp']
            const availableMethods = Array.isArray(rawMethods) ? rawMethods : Object.keys(rawMethods)
            const defaultMethod = data.default_method || (availableMethods.length === 1 ? availableMethods[0] : null)

            this.mfaSession = {
              email: data.email || credentials.email,
              loginTime: Date.now(),
              available_methods: availableMethods,
              default_method: defaultMethod,
              active_method: null // On affiche d'abord le sélecteur
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
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/auth/mfaMtd-topt-resend', {
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

    // Sélectionner une méthode MFA
    async selectMfaMethod(method: string) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfa-select-method', {
          method: 'POST',
          body: { email: this.mfaSession.email, method }
        })
        if (response.success) {
          this.mfaSession.active_method = method
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la sélection'
        return false
      } finally {
        this.loading = false
      }
    },

    // Connexion avec Authenticator
    async loginWithAuthenticator(code: string) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfaMtd-auth-app', {
          method: 'POST',
          body: { email: this.mfaSession.email, code }
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
        this.error = err.data?.message || 'Code incorrect ou expiré'
        return false
      } finally {
        this.loading = false
      }
    },

    // Envoyer un lien magique (MFA)
    async loginWithMagicLink() {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfaMtd-magic-link', {
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
        this.error = err.data?.message || 'Erreur lors de l\'envoi'
        return false
      } finally {
        this.loading = false
      }
    },

    // Vérifier un lien magique
    async verifyMagicLink(email: string, token: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfaMtd-magic-verify', {
          method: 'GET',
          params: { email, token }
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
        this.error = err.data?.message || 'Lien invalide ou expiré'
        return false
      } finally {
        this.loading = false
      }
    },

    // Vérifier le code MFA (Security Code ou TOTP Email)
    async verifyMfa(code: string) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{
          success: boolean;
          message: string;
          data: { user: User; token: string }
        }>('/api/user/auth/mfaMtd-topt-verify', {
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

    // Connexion avec un Code de Secours
    async loginWithSecurityCode(code: string) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfaMtd-sec-codes', {
          method: 'POST',
          body: { email: this.mfaSession.email, code }
        })
        if (response.success || response.message) {
          if (response.data?.user) this.user = response.data.user
          this.message = response.message || response.data?.message
          this.mfaSession = null
          return response
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Code de secours invalide'
        return false
      } finally {
        this.loading = false
      }
    },

    // Obtenir les options Passkey
    async getPasskeyOptions() {
      if (!this.mfaSession) return null
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfaMtd-passkey-options', {
          method: 'GET',
          params: { email: this.mfaSession.email }
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Options WebAuthn inaccessibles'
        return null
      }
    },

    // Connexion via Passkey
    async loginWithPasskey(assertion: any) {
      if (!this.mfaSession) return false
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/auth/mfaMtd-passkey-verify', {
          method: 'POST',
          body: assertion
        })
        if (response.success || response.token || response.user) {
          const user = response.data?.user || response.user
          if (user) this.user = user
          this.message = response.message || 'Connecté via Passkey'
          this.mfaSession = null
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Vérification Passkey échouée'
        return false
      } finally {
        this.loading = false
      }
    },
  }
})
