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
    }
  }
})
