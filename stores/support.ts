import { defineStore } from 'pinia'

export const useSupportStore = defineStore('support', {
  state: () => ({
    loading: false,
    error: null as string | null
  }),

  actions: {
    async partnershipRequest(data: { organization_name: string; contact_name: string; email: string; message: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string; data: any }>('/api/support/partnership', {
          method: 'POST',
          body: data
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de l\'envoi de la demande.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async contactRequest(data: { full_name: string; email: string; subject: string; message: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string; data: any }>('/api/support/contact', {
          method: 'POST',
          body: data
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de l\'envoi du message.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
