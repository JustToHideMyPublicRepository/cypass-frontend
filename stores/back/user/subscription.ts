import { defineStore } from 'pinia'
import type { Subscription, SubscriptionResponse } from '~/types/subscription'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    loading: false,
    error: null as string | null,
    message: null as string | null,
  }),

  actions: {
    async subscribe(packageSlug: string) {
      this.loading = true
      this.error = null
      this.message = null

      try {
        const response = await $fetch<{
          success: boolean;
          message: string;
          data: { checkout_url: string; transaction_id: string; payment_id: string }
        }>('/api/user/subscriptions/subscribe', {
          method: 'POST',
          body: { package: packageSlug }
        })

        if (response.success) {
          this.message = response.message
          return response.data.checkout_url
        }

        this.error = response.message || 'Impossible de générer le lien de paiement'
        return null
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la souscription'
        return null
      } finally {
        this.loading = false
      }
    },

    async getLatestSubscriptions() {
      this.loading = true
      try {
        const response = await $fetch<SubscriptionResponse<Subscription[]>>('/api/user/subscriptions/latest')
        return response.data
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de récupérer les transactions'
        return []
      } finally {
        this.loading = false
      }
    },

    async getSubscription(id: string) {
      this.loading = true
      try {
        const response = await $fetch<SubscriptionResponse<Subscription>>('/api/user/subscriptions/get', {
          query: { id }
        })
        return response.data
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de récupérer les détails'
        return null
      } finally {
        this.loading = false
      }
    },

    downloadReceipt(id: string | number) {
      window.open(`/api/user/subscriptions/download?id=${id}`, '_blank')
    }
  }
})
