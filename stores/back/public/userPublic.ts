import { defineStore } from 'pinia'

interface PublicProfileResponse {
  success: boolean
  data?: {
    user: any
    activity?: {
      public_incidents: any[]
      comments: any[]
    }
  }
  message?: string
}

export const useUserPublicStore = defineStore('userPublic', {
  state: () => ({
    user: null as any,
    publicIncidents: [] as any[],
    comments: [] as any[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async getPublicProfile(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<PublicProfileResponse>('/api/public/user/get', {
          params: { id }
        })

        if (response.success && response.data) {
          this.user = response.data.user
          this.publicIncidents = response.data.activity?.public_incidents || []
          this.comments = response.data.activity?.comments || []
          return true
        } else {
          this.error = response.message || 'Impossible de charger le profil'
          return false
        }
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors du chargement du profil'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
