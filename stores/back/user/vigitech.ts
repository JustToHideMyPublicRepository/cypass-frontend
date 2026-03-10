import { defineStore } from 'pinia'
import type { Incident, Comment, CreateIncidentRequest } from '~/types/vigitech'
import { usePublicVigitechStore } from '../public/vigitech'

export const useUserVigitechStore = defineStore('userVigitech', {
  state: () => ({
    userIncidents: [] as Incident[],
    currentIncident: null as Incident | null,
    userComments: [] as Comment[],
    userCommentsTotal: 0,
    loadingComments: false,
    loading: false,
    error: null as string | null
  }),

  actions: {
    // Ajouter un commentaire
    async addComment(incidentId: string, content: string) {
      try {
        const response: any = await $fetch('/api/user/vigitech/comment-add', {
          method: 'POST',
          body: { incident_id: incidentId, content }
        })
        if (response.success) {
          await usePublicVigitechStore().fetchComments(incidentId)
          return { success: true, message: response.message }
        }
        return { success: false, message: response.message || 'Impossible de publier le commentaire.' }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Impossible de publier le commentaire.' }
      }
    },

    // Supprimer un commentaire
    async deleteComment(commentId: string, incidentId?: string) {
      try {
        const response: any = await $fetch('/api/user/vigitech/comment-delete', {
          method: 'DELETE',
          query: { comment_id: commentId }
        })
        if (response.success) {
          if (incidentId) {
            await usePublicVigitechStore().fetchComments(incidentId)
          }
          // Also remove from user comments list if present
          this.userComments = this.userComments.filter(c => c.id !== commentId)
          this.userCommentsTotal = Math.max(0, this.userCommentsTotal - 1)
        }
        return { success: response.success, message: response.message }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la suppression du commentaire.' }
      }
    },

    // Récuperer les commentaires de l'utilisateur
    async fetchUserComments() {
      this.loadingComments = true
      try {
        const response: any = await $fetch('/api/user/vigitech/comment-list')
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

    // Mettre à jour un commentaire
    async updateComment(commentId: string, content: string, incidentId?: string) {
      try {
        const response: any = await $fetch('/api/user/vigitech/comment-update', {
          method: 'PUT',
          body: { comment_id: commentId, content }
        })
        if (response.success && incidentId) {
          await usePublicVigitechStore().fetchComments(incidentId)
        }
        return { success: response.success, message: response.message }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la mise à jour du commentaire.' }
      }
    },

    // Créer un incident
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

        const response: any = await $fetch('/api/user/vigitech/incident-add', {
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

    // Supprimer un incident    
    async deleteIncident(incidentId: string) {
      try {
        const response: any = await $fetch('/api/user/vigitech/incident-delete', {
          method: 'DELETE',
          query: { incident_id: incidentId }
        })
        if (response.success) {
          this.userIncidents = this.userIncidents.filter(i => i.id !== incidentId)
          if (this.currentIncident?.id === incidentId) this.currentIncident = null
        }
        return { success: response.success, message: response.message }
      } catch (err: any) {
        return { success: false, message: err.data?.message || err.message || 'Erreur lors de la suppression.' }
      }
    },

    // Récupérer un incident par son id  
    async fetchUserIncidentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch(`/api/user/vigitech/incident-get`, {
          query: { id }
        })
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

    // Récupérer tous les incidents
    async fetchUserIncidents() {
      this.loading = true
      this.error = null
      try {
        const response: any = await $fetch('/api/user/vigitech/incident-list')
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

    // Mettre à jour un incident
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

        const response: any = await $fetch('/api/user/vigitech/incident-update', {
          method: 'PUT',
          body: { incident_id: incidentId, ...body }
        })
        if (response.success) {
          await this.fetchUserIncidentById(incidentId)
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
  }
})
