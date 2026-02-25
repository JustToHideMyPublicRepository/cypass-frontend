import { defineStore } from 'pinia'
import type { Incident, Comment, CreateIncidentRequest } from '../types/vigitech'

export const useVigitechStore = defineStore('vigitech', {
  state: () => ({
    userIncidents: [] as Incident[],
    publicIncidents: [] as Incident[],
    publicPagination: {
      total: 0,
      limit: 10,
      offset: 0
    },
    currentIncident: null as Incident | null,
    comments: [] as Comment[],
    userComments: [] as any[],
    userCommentsTotal: 0,
    loadingComments: false,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchUserIncidents() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/vigitech/user/all')
        if (response.success) {
          this.userIncidents = response.data
        } else {
          this.error = response.message || 'Erreur lors de la récupération de vos incidents'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchPublicIncidents(params: any = {}) {
      this.loading = true
      this.error = null
      try {
        const query = {
          ...params,
          limit: params.limit || this.publicPagination.limit,
          offset: params.offset || this.publicPagination.offset
        }
        const response: any = await $fetch('/api/vigitech/all', { params: query })
        if (response.success) {
          this.publicIncidents = response.data
          this.publicPagination.total = response.total || (response.data.length < query.limit ? query.offset + response.data.length : 100)
          this.publicPagination.limit = query.limit
          this.publicPagination.offset = query.offset
        } else {
          this.error = response.message || 'Erreur lors de la récupération des incidents publics'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchUserIncidentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch(`/api/vigitech/user/${id}`)
        if (response.success) {
          this.currentIncident = response.data
        } else {
          this.error = response.message || 'Incident non trouvé'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchPublicIncidentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch(`/api/vigitech/${id}`)
        if (response.success) {
          this.currentIncident = response.data
        } else {
          this.error = response.message || 'Incident non trouvé'
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchComments(incidentId: string) {
      this.loadingComments = true
      try {
        const response: any = await $fetch('/api/vigitech/comments', {
          params: { incident_id: incidentId }
        })
        if (response.success) {
          this.comments = response.data || []
        }
      } catch (err: any) {
        console.warn('Erreur chargement commentaires:', err.message)
      } finally {
        this.loadingComments = false
      }
    },

    async fetchUserComments() {
      this.loadingComments = true
      try {
        const response: any = await $fetch('/api/vigitech/user/comments')
        if (response.success && response.data) {
          this.userComments = response.data.comments || []
          this.userCommentsTotal = response.data.total || 0
        }
      } catch (err: any) {
        console.warn('Erreur chargement commentaires utilisateur:', err.message)
      } finally {
        this.loadingComments = false
      }
    },

    async addComment(incidentId: string, content: string) {
      try {
        const response: any = await $fetch('/api/vigitech/comments', {
          method: 'POST',
          body: { incident_id: incidentId, content }
        })
        if (response.success) {
          await this.fetchComments(incidentId)
          return { success: true, message: response.message }
        }
        return { success: false, message: response.message || 'Impossible de publier le commentaire.' }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Impossible de publier le commentaire.' }
      }
    },

    async createIncident(payload: CreateIncidentRequest) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('title', payload.title)
        formData.append('description', payload.description)
        formData.append('type', payload.type)
        formData.append('threat_level', payload.threat_level)
        formData.append('is_anonymous', payload.is_anonymous ? 'true' : 'false')
        formData.append('location', payload.location)
        if (payload.evidence) {
          formData.append('evidence', payload.evidence)
        }

        const response: any = await $fetch('/api/vigitech/create', {
          method: 'POST',
          body: formData
        })

        if (response.success) {
          await this.fetchUserIncidents()
          return response.data
        } else {
          this.error = response.message || 'Erreur lors du signalement'
          return null
        }
      } catch (err: any) {
        this.error = err.data?.message || err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async reportIncident(incidentId: string, reason: string, details: string) {
      try {
        const response: any = await $fetch('/api/vigitech/report', {
          method: 'POST',
          body: { incident_id: incidentId, reason, details }
        })
        return { success: response.success, message: response.message }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors du signalement.' }
      }
    },

    async updateIncident(incidentId: string, data: Record<string, string | boolean>) {
      try {
        const body: Record<string, string> = {}
        for (const key in data) {
          if (typeof data[key] === 'boolean') {
            body[key] = data[key] ? 'true' : 'false'
          } else {
            body[key] = data[key] as string
          }
        }

        const response: any = await $fetch('/api/vigitech/update', {
          method: 'PUT',
          body: { incident_id: incidentId, ...body }
        })
        if (response.success) {
          // Refresh the current incident data
          await this.fetchUserIncidentById(incidentId)
          // Also update the item in the userIncidents list for real-time refresh on dashboard
          if (this.currentIncident) {
            const idx = this.userIncidents.findIndex(i => i.id === incidentId)
            if (idx !== -1) {
              this.userIncidents[idx] = { ...this.userIncidents[idx], ...this.currentIncident }
            }
          }
        }
        return { success: response.success, message: response.message }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la mise à jour.' }
      }
    },

    async updateComment(commentId: string, content: string, incidentId?: string) {
      try {
        const response: any = await $fetch('/api/vigitech/comments', {
          method: 'PUT',
          body: { comment_id: commentId, content }
        })
        if (response.success && incidentId) {
          await this.fetchComments(incidentId)
        }
        return { success: response.success, message: response.message }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la mise à jour du commentaire.' }
      }
    }
  }
})
