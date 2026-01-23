import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  email: string
  name: string
  organization_name: string | null
  role: string
  email_verified: boolean
  created_at: string
}

interface Statistics {
  total_documents: number
  total_incidents: number
}

interface ProfilState {
  profile: UserProfile | null
  statistics: Statistics | null
  loading: boolean
  error: string | null
  message: string | null
}

export const useProfilStore = defineStore('profil', {
  state: (): ProfilState => ({
    profile: null,
    statistics: null,
    loading: false,
    error: null,
    message: null
  }),

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; user: UserProfile; statistics: Statistics }>('/api/profile')
        if (response.success) {
          this.profile = response.user
          this.statistics = response.statistics
          return true
        }
        this.error = 'Impossible de récupérer le profil'
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue lors de la récupération du profil'
        return false
      } finally {
        this.loading = false
      }
    },

    async updateEmail(newEmail: string, currentPassword: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/email', {
          method: 'PUT',
          body: { new_email: newEmail, current_password: currentPassword }
        })
        if (response.success) {
          this.message = response.message
          // Profile needs refresh to show "pending" status badge
          await this.fetchProfile()
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue'
        return false
      } finally {
        this.loading = false
      }
    },

    async updatePassword(current: string, newPass: string, confirm: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/profile/password', {
          method: 'PUT',
          body: {
            current_password: current,
            new_password: newPass,
            confirm_password: confirm
          }
        })
        if (response.success) {
          this.message = response.message
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Une erreur est survenue'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
