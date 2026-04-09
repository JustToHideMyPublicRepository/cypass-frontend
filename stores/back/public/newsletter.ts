import { defineStore } from 'pinia'

export const usePublicNewsletterStore = defineStore('publicNewsletter', {
  state: () => ({
    loading: false,
    error: null as string | null
  }),

  actions: {
    async subscribe(payload: { first_name?: string; last_name?: string; email: string }): Promise<any> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<any>('/api/public/newsletter/subscribe', {
          method: 'POST',
          body: payload
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Une erreur est survenue lors de l\'inscription.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async verify(token: string): Promise<any> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<any>('/api/public/newsletter/verify', {
          method: 'GET',
          query: { token }
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Une erreur est survenue lors de la vérification.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async updatePreferences(payload: { 
      email: string; 
      token: string; 
      first_name?: string; 
      last_name?: string; 
      marketing?: boolean; 
      product?: boolean; 
      security?: boolean 
    }): Promise<any> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<any>('/api/public/newsletter/preferences', {
          method: 'PATCH',
          body: payload
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Impossible de mettre à jour vos préférences.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async unsubscribe(payload: { email: string; token?: string; confirm: boolean; confirmation_text: string }): Promise<any> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<any>('/api/public/newsletter/unsubscribe', {
          method: 'POST',
          body: payload
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Erreur lors de la désinscription.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async requestManagementLink(email: string): Promise<any> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<any>('/api/public/newsletter/request-access', {
          method: 'POST',
          body: { email }
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Impossible d\'envoyer le lien de gestion.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
