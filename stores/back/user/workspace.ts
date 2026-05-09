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
    isCreateModalOpen: false,
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
      this.createLoading = true
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
          this.isCreateModalOpen = false
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

    // Initialisation au montage du layout
    async initWorkspace() {
      await this.fetchWorkspaces()

      if (this.workspaces.length === 0) return

      // Restaurer depuis localStorage
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

      // Par défaut : prendre le workspace "default" ou le premier
      const defaultWs = this.workspaces.find(w => w.status === 'default')
      this.activeWorkspace = defaultWs || this.workspaces[0]

      if (import.meta.client && this.activeWorkspace) {
        localStorage.setItem(ACTIVE_WS_KEY, this.activeWorkspace.id)
      }
    },

    // Ouvrir/fermer le switcher
    toggleSwitcher() {
      this.isSwitcherOpen = !this.isSwitcherOpen
    },

    closeSwitcher() {
      this.isSwitcherOpen = false
    },

    // Ouvrir/fermer la modale de création
    openCreateModal() {
      this.isCreateModalOpen = true
      this.isSwitcherOpen = false
    },

    closeCreateModal() {
      this.isCreateModalOpen = false
      this.error = null
    }
  }
})
