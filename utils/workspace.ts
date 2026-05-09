import type { WorkspaceRole, WorkspaceStatus, WorkspaceType } from '~/types/workspace'

/**
 * Libellés des rôles de workspace.
 */
export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: 'Propriétaire',
  admin: 'Administrateur',
  editor: 'Éditeur',
  reader: 'Lecteur'
}

/**
 * Libellés des statuts de workspace.
 */
export const WORKSPACE_STATUS_LABELS: Record<WorkspaceStatus, string> = {
  default: 'Défaut',
  active: 'Actif',
  trashed: 'Corbeille',
  archived: 'Archivé'
}

/**
 * Libellés des types de workspace.
 */
export const WORKSPACE_TYPE_LABELS: Record<WorkspaceType, string> = {
  personal: 'Personnel',
  pme: 'PME / Entreprise'
}

/**
 * Options pour le sélecteur de type dans le formulaire.
 */
export const WORKSPACE_TYPE_OPTIONS: { value: WorkspaceType; label: string }[] = [
  { value: 'personal', label: 'Personnel' },
  { value: 'pme', label: 'PME / Entreprise' }
]

/**
 * Retourne le libellé français d'un rôle de workspace.
 */
export const getWorkspaceRoleLabel = (role?: WorkspaceRole | null): string => {
  if (!role) return ''
  return WORKSPACE_ROLE_LABELS[role] || role
}

/**
 * Retourne le libellé français d'un statut de workspace.
 */
export const getWorkspaceStatusLabel = (status?: WorkspaceStatus | null): string => {
  if (!status) return ''
  return WORKSPACE_STATUS_LABELS[status] || status
}

/**
 * Retourne le libellé français d'un type de workspace.
 */
export const getWorkspaceTypeLabel = (type?: WorkspaceType | null): string => {
  if (!type) return ''
  return WORKSPACE_TYPE_LABELS[type] || type
}

/**
 * Résout l'URL du logo d'un workspace.
 * Utilise Dicebear identicon en fallback (au lieu de initials).
 */
export const getWorkspaceLogoUrl = (
  logoUrl: string | null | undefined,
  workspaceName?: string | null
): string => {
  // 1. Si un logo est uploadé
  if (logoUrl && logoUrl.trim() !== '') {
    if (logoUrl.startsWith('http')) {
      return logoUrl
    }
    // Clean et prefix avec /uploads/
    const cleanPath = logoUrl.replace(/^\/+/, '').replace(/^uploads\//i, '').replace(/^\/+/, '')
    return `/uploads/${cleanPath}`
  }

  // 2. Fallback Dicebear identicon
  const seed = workspaceName?.trim() || 'Workspace'
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}`
}
