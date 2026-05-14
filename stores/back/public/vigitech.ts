import { defineStore } from 'pinia'
import type { Incident, Comment } from '~/types/vigitech'

export const usePublicVigitechStore = defineStore('publicVigitech', {
  state: () => ({
    publicIncidents: [] as Incident[],
    publicPagination: {
      total: 0,
      limit: 10,
      offset: 0
    },
    commentsPagination: {
      total: 0,
      limit: 10,
      offset: 0,
      hasMore: true
    },
    globalStats: {
      total: 0,
      phishing: 0,
      critical: 0
    },
    currentIncident: null as Incident | null,
    comments: [] as Comment[],
    loadingComments: false,
    loading: false,
    error: null as string | null
  }),

  actions: {
    // Récuperer les commentaires d'un incident
    async fetchComments(incidentId: string, append: boolean = false) {
      this.loadingComments = true
      try {
        const limit = this.commentsPagination.limit
        const offset = append ? this.commentsPagination.offset : 0

        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response: any = await $fetch('/api/public/vigitech/comment-list', {
          headers,
          params: {
            incident_id: incidentId,
            limit,
            offset
          }
        })

        if (response.success && response.data) {
          const newComments = response.data || []

          if (append) {
            this.comments = [...this.comments, ...newComments]
          } else {
            this.comments = newComments
          }

          // Update pagination state
          const totalReceived = newComments.length
          const currentTotalCount = this.comments.length
          const totalFromBackend = response.total || 0

          this.commentsPagination.offset = append ? this.commentsPagination.offset + totalReceived : totalReceived
          this.commentsPagination.total = totalFromBackend || currentTotalCount

          // More robust hasMore check
          if (totalFromBackend > 0) {
            this.commentsPagination.hasMore = currentTotalCount < totalFromBackend
          } else {
            this.commentsPagination.hasMore = totalReceived >= limit
          }
        }
      } catch (err: any) {
        console.warn('Erreur chargement commentaires:', err.message)
      } finally {
        this.loadingComments = false
      }
    },

    // Récuperer les réponses d'un commentaire
    async fetchReplies(incidentId: string, parentId: string, offset: number = 0, limit: number = 10) {
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response: any = await $fetch('/api/public/vigitech/comment-list', {
          headers,
          params: {
            incident_id: incidentId,
            parent_id: parentId,
            limit,
            offset
          }
        })

        if (response.success) {
          const replies = response.data || []
          const total = response.total || replies.length

          // Update centralized state if the parent exists
          const parent = this.comments.find(c => c.id === parentId)
          if (parent) {
            parent.replies = replies
            parent.replies_count = total
          }

          return {
            success: true,
            data: replies,
            total
          }
        }
        return { success: false, data: [] }
      } catch (err: any) {
        console.warn('Erreur chargement réponses:', err.message)
        return { success: false, data: [] }
      }
    },

    // Récupérer un incident public par son id  
    async fetchPublicIncidentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response: any = await $fetch('/api/public/vigitech/incident-get', {
          headers,
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

    // Récupérer tous les incidents publics
    async fetchPublicIncidents(params: any = {}) {
      this.loading = true
      this.error = null
      try {
        const query = {
          limit: params.limit || this.publicPagination.limit,
          offset: params.offset || this.publicPagination.offset,
          ...params
        }
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        const response: any = await $fetch('/api/public/vigitech/incident-list', { headers, params: query })
        if (response.success) {
          this.publicIncidents = response.data
          // Accurate total calculation if not provided by backend
          if (response.total) {
            this.publicPagination.total = response.total
          } else {
            // If data received is less than limit, we know the exact total
            if (response.data.length < query.limit) {
              this.publicPagination.total = query.offset + response.data.length
            } else if (this.publicPagination.total < query.offset + response.data.length) {
              // Otherwise, only update if it's higher than what we have
              this.publicPagination.total = query.offset + response.data.length
            }
          }
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

    async fetchGlobalStats() {
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) as any : {}
        // In a real app, this should be a dedicated /stats endpoint
        const response: any = await $fetch('/api/public/vigitech/incident-list', {
          headers,
          params: { limit: 1000, offset: 0 }
        })
        if (response.success && response.data) {
          const all = response.data
          const total = response.total || all.length
          this.globalStats = {
            total,
            phishing: all.filter((i: any) => i.type === 'phishing').length,
            critical: all.filter((i: any) => i.threat_level === 'critical').length
          }
          this.publicPagination.total = total
        }
      } catch (err: any) {
        console.warn('Erreur chargement stats globales:', err.message)
      }
    },

    // Synchroniser un seul commentaire (par ex après une réaction)
    async syncSingleComment(commentId: string) {
      try {
        const response: any = await $fetch('/api/user/vigitech/comment-get', {
          query: { id: commentId }
        })

        if (response.success && response.data) {
          const newComment = response.data
          const idx = this.comments.findIndex(c => c.id === commentId)
          if (idx !== -1) {
            // Update the comment in place to keep reactivity smooth
            this.comments[idx] = { ...this.comments[idx], ...newComment }
            return true
          }
        }
        return false
      } catch (err: any) {
        console.warn('Erreur synchronisation commentaire:', err.message)
        return false
      }
    },

    // Mettre à jour les réactions d'un commentaire localement pour éviter le rechargement complet
    updateCommentReactionLocally(commentId: string, reactionsSummary: any, reactionsDetails: any[], reactionsCount: number, parentId?: string) {
      if (parentId) {
        const parent = this.comments.find(c => c.id === parentId)
        if (parent && parent.replies) {
          const reply = parent.replies.find(r => r.id === commentId)
          if (reply) {
            reply.reactions_summary = reactionsSummary
            reply.reactions_details = reactionsDetails
            reply.reactions_count = reactionsCount
          }
        }
      } else {
        const comment = this.comments.find(c => c.id === commentId)
        if (comment) {
          comment.reactions_summary = reactionsSummary
          comment.reactions_details = reactionsDetails
          comment.reactions_count = reactionsCount
        }
      }
    },

    addCommentLocally(comment: Comment) {
      this.comments = [comment, ...this.comments]
      this.commentsPagination.total++
    }
  }
})
