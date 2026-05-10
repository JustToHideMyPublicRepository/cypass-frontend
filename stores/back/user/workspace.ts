import { defineStore } from 'pinia'
import { type Workspace, type WorkspaceDetail, type WorkspaceMember, type CreateWorkspacePayload } from '~/types/workspace'

const ACTIVE_WS_KEY = 'cps_active_workspace'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspaces: [] as Workspace[],
    activeWorkspace: null as Workspace | null,
    currentDetail: null as WorkspaceDetail | null,
    loading: false,
    createLoading: false,
    error: null as string | null,
    message: null as string | null,
    isModalOpen: false,
    editingWorkspace: null as Workspace | null,
    isSwitcherOpen: false
  }),

  getters: {
    activeWorkspaceId: (state) => state.activeWorkspace?.id || null,
    hasWorkspaces: (state) => state.workspaces.length > 0
  },

  actions: {
    // Charger tous les workspaces
    async fetchWorkspaces() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; workspaces: Workspace[] }>('/api/user/workspace/list')
        if (response.success) {
          this.workspaces = response.workspaces
        }
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération des workspaces'
        console.error('Failed to fetch workspaces', err)
      } finally {
        this.loading = false
      }
    },

    // Récupérer un workspace par ID
    async fetchWorkspaceById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; workspace: Workspace; members: WorkspaceMember[] }>('/api/user/workspace/get', {
          query: { id }
        })
        if (response.success) {
          this.currentDetail = {
            workspace: response.workspace,
            members: response.members
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération du workspace'
        return false
      } finally {
        this.loading = false
      }
    },

    // Créer un workspace
    async createWorkspace(payload: CreateWorkspacePayload) {
      this.error = null
      this.message = null
      try {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('type', payload.type)
        if (payload.logo) formData.append('logo', payload.logo)
        if (payload.rccm) formData.append('rccm', payload.rccm)
        if (payload.ifu) formData.append('ifu', payload.ifu)
        if (payload.country) formData.append('country', payload.country)

        const response = await $fetch<{ success: boolean; message: string; workspace: Workspace }>('/api/user/workspace/create', {
          method: 'POST',
          body: formData
        })

        if (response.success) {
          this.message = response.message
          this.workspaces.push(response.workspace)
          this.setActiveWorkspace(response.workspace)
          this.isModalOpen = false
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la création du workspace'
        return false
      } finally {
        this.createLoading = false
      }
    },

    // Définir le workspace actif
    setActiveWorkspace(workspace: Workspace) {
      this.activeWorkspace = workspace
      this.isSwitcherOpen = false
      if (import.meta.client) {
        localStorage.setItem(ACTIVE_WS_KEY, workspace.id)
      }
    },

    // Définir le workspace actif via son slug
    setActiveWorkspaceBySlug(slug: string) {
      const found = this.workspaces.find(w => w.slug === slug)
      if (found) {
        this.setActiveWorkspace(found)
        return true
      }
      return false
    },

    // Initialisation au montage du layout
    async initWorkspace(slugFromRoute?: string) {
      await this.fetchWorkspaces()

      if (this.workspaces.length === 0) return

      // Priorité 1 : Slug venant de l'URL
      if (slugFromRoute) {
        const found = this.workspaces.find(w => w.slug === slugFromRoute)
        if (found) {
          this.setActiveWorkspace(found)
          return
        }
      }

      // Priorité 2 : Restaurer depuis localStorage
      if (import.meta.client) {
        const savedId = localStorage.getItem(ACTIVE_WS_KEY)
        if (savedId) {
          const found = this.workspaces.find(w => w.id === savedId)
          if (found) {
            this.activeWorkspace = found
            return
          }
        }
      }

      // Par défaut : prendre le workspace "is_default" ou le premier
      const defaultWs = this.workspaces.find(w => w.is_default)
      this.activeWorkspace = defaultWs || this.workspaces[0]

      if (import.meta.client && this.activeWorkspace) {
        localStorage.setItem(ACTIVE_WS_KEY, this.activeWorkspace.id)
      }
    },

    // Mettre à jour un workspace
    async updateWorkspace(id: string, payload: CreateWorkspacePayload) {
      this.error = null
      this.message = null
      try {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('type', payload.type)
        if (payload.logo) formData.append('logo', payload.logo)
        if (payload.rccm) formData.append('rccm', payload.rccm)
        if (payload.ifu) formData.append('ifu', payload.ifu)
        if (payload.country) formData.append('country', payload.country)

        const response = await $fetch<{ success: boolean; message: string; workspace: Workspace }>(`/api/user/workspace/update`, {
          method: 'PUT',
          query: { id },
          body: formData
        })

        if (response.success) {
          this.message = response.message
          // Mettre à jour dans la liste
          const index = this.workspaces.findIndex(w => w.id === id)
          if (index !== -1) {
            this.workspaces[index] = response.workspace
          }
          // Si c'est le workspace actif, mettre à jour la référence
          if (this.activeWorkspace?.id === id) {
            this.activeWorkspace = response.workspace
          }
          this.isModalOpen = false
          this.editingWorkspace = null
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la mise à jour du workspace'
        return false
      } finally {
        this.createLoading = false
      }
    },

    // Supprimer (archiver) un workspace
    async deleteWorkspace(id: string) {
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>(`/api/user/workspace/delete`, {
          method: 'DELETE',
          query: { id }
        })

        if (response.success) {
          this.message = response.message
          // Retirer de la liste
          this.workspaces = this.workspaces.filter(w => w.id !== id)
          // Si c'était le workspace actif, basculer sur un autre
          if (this.activeWorkspace?.id === id) {
            this.initWorkspace()
          }
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la suppression du workspace'
        return false
      } finally {
        this.loading = false
      }
    },

    // Définir un workspace par défaut
    async setDefaultWorkspace(id: string) {
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/user/workspace/set-default', {
          method: 'POST',
          body: { id }
        })

        if (response.success) {
          this.message = response.message
          // Mettre à jour localement
          this.workspaces = this.workspaces.map(w => ({
            ...w,
            is_default: w.id === id
          }))
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la définition du workspace par défaut'
        return false
      } finally {
        this.loading = false
      }
    },

    // Ouvrir/fermer le switcher
    toggleSwitcher() {
      this.isSwitcherOpen = !this.isSwitcherOpen
    },

    closeSwitcher() {
      this.isSwitcherOpen = false
    },

    // Ouvrir/fermer la modale
    openModal(workspace: Workspace | null = null) {
      this.editingWorkspace = workspace
      this.isModalOpen = true
      this.isSwitcherOpen = false
    },

    closeModal() {
      this.isModalOpen = false
      this.editingWorkspace = null
      this.error = null
    }
  }
})
