import { defineStore } from 'pinia'
import { type User, type AuthState } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    message: null
  } as AuthState),

  getters: {
    fullName: (state) => {
      if (!state.user) return 'Vous'
      return `${state.user.first_name} ${state.user.last_name}`.trim() || 'Vous'
    },
    avatarUrl: (state) => {
      if (state.user?.avatar_url && state.user.avatar_url.trim() !== '') {
        const url = state.user.avatar_url
        if (url.startsWith('http')) return url
        const cleanUrl = url.replace(/^\/+/, '')
        return `/${cleanUrl}`
      }
      const seed = state.user ? `${state.user.first_name} ${state.user.last_name}`.trim() : 'Utilisateur'
      return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`
    }
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string; data: { user: User; token: string } }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        if (response.success) {
          this.user = response.data.user
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la connexion'
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
      try {
        const response = await $fetch<{ success: boolean; data: { user: User } }>('/api/auth/me')
        if (response.success) {
          this.user = response.data.user
        }
      } catch (err) {
        this.user = null
      }
    }
  }
})
