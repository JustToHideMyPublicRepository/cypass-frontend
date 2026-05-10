export type WorkspaceStatus = 'default' | 'active' | 'trashed' | 'archived'
export type WorkspaceType = 'personal' | 'pme' | 'institution' | 'cabinet' | 'other'
export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'reader'

export interface Workspace {
  id: string
  name: string
  slug?: string
  status: WorkspaceStatus
  type: WorkspaceType
  logo_url: string | null
  rccm?: string | null
  ifu?: string | null
  country: string | null
  role?: WorkspaceRole
  my_role?: WorkspaceRole
  members_count?: number
  can_certify?: boolean
  created_at: string
  is_default?: boolean
}

export interface WorkspaceMember {
  user_id: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  role: WorkspaceRole
  joined_at: string
}

export interface WorkspaceDetail {
  workspace: Workspace
  members: WorkspaceMember[]
}

export interface CreateWorkspacePayload {
  name: string
  type: WorkspaceType
  logo?: File | null
  delete_logo?: boolean
  rccm?: string
  ifu?: string
  country?: string
}
