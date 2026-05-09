export type WorkspaceStatus = 'default' | 'active'
export type WorkspaceType = 'personal' | 'pme'
export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
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
  rccm?: string
  ifu?: string
  country?: string
}
