import { defineStore } from 'pinia'
import type { ContactRequestPayload, PartnershipRequestPayload, SupportResponse, SupportSuccessResponse, SupportErrorResponse } from '~/types'

export const useSupportStore = defineStore('support', {
  state: () => ({
    loading: false,
    error: null as string | null
  }),

  actions: {
    // Contacte
    async contactRequest(data: ContactRequestPayload): Promise<SupportResponse> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<SupportSuccessResponse>('/api/public/support/contact', {
          method: 'POST',
          body: data
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de l\'envoi du message.'
        return { success: false, message: this.error } as SupportErrorResponse
      } finally {
        this.loading = false
      }
    },

    // Partenaires
    async partnershipRequest(data: PartnershipRequestPayload): Promise<SupportResponse> {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<SupportSuccessResponse>('/api/public/support/partnership', {
          method: 'POST',
          body: data
        })
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de l\'envoi de la demande.'
        return { success: false, message: this.error } as SupportErrorResponse
      } finally {
        this.loading = false
      }
    },
  }
})
