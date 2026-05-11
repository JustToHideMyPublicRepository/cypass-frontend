import { IconSticker2, IconUser, IconBuilding, IconHome, IconBriefcase, IconCircle, IconCrown, IconShield, IconEdit, IconEye, IconCircleCheck, IconTrash, IconArchive } from '@tabler/icons-vue'
import type { WorkspaceRole, WorkspaceStatus, WorkspaceType } from '~/types/workspace'

/**
 * Configuration des types de workspace pour les labels et les badges.
 */
export const WORKSPACE_TYPE_CONFIG = {
  personal: {
    label: 'Personnel',
    icon: IconUser,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  pme: {
    label: 'PME',
    icon: IconBuilding,
    color: 'text-secondary',
    bg: 'bg-secondary/10'
  },
  institution: {
    label: 'Institution',
    icon: IconHome,
    color: 'text-success',
    bg: 'bg-success/10'
  },
  cabinet: {
    label: 'Cabinet',
    icon: IconBriefcase,
    color: 'text-warning',
    bg: 'bg-warning/10'
  },
  other: {
    label: 'Autre',
    icon: IconCircle,
    color: 'text-hsa',
    bg: 'bg-hsa/10'
  }
} as const

/**
 * Options pour les sélecteurs.
 */
export const WORKSPACE_TYPE_OPTIONS = Object.entries(WORKSPACE_TYPE_CONFIG).map(([value, config]) => ({
  value: value as WorkspaceType,
  label: config.label
}))

/**
 * Configuration des rôles avec badges.
 */
export const WORKSPACE_ROLE_CONFIG = {
  owner: {
    label: 'Propriétaire',
    color: 'text-primary',
    bg: 'bg-primary/10',
    icon: IconCrown
  },
  admin: {
    label: 'Administrateur',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    icon: IconShield
  },
  editor: {
    label: 'Éditeur',
    color: 'text-warning',
    bg: 'bg-warning/10',
    icon: IconEdit
  },
  reader: {
    label: 'Lecteur',
    color: 'text-hsa',
    bg: 'bg-hsa/10',
    icon: IconEye
  }
} as const

/**
 * Configuration des statuts avec badges.
 */
export const WORKSPACE_STATUS_CONFIG = {
  default: {
    label: 'Défaut',
    color: 'text-hsa',
    bg: 'bg-hsa/10',
    icon: IconSticker2
  },
  active: {
    label: 'Actif',
    color: 'text-success',
    bg: 'bg-success/10',
    icon: IconCircleCheck
  },
  trashed: {
    label: 'Corbeille',
    color: 'text-danger',
    bg: 'bg-danger/10',
    icon: IconTrash
  },
  archived: {
    label: 'Archivé',
    color: 'text-warning',
    bg: 'bg-warning/10',
    icon: IconArchive
  }
} as const

/**
 * Retourne le libellé d'un rôle.
 */
export const getWorkspaceTypeLabel = (type?: WorkspaceType | null): string => {
  if (!type) return ''
  return WORKSPACE_TYPE_CONFIG[type]?.label || type
}

/**
 * Retourne le libellé d'un rôle.
 */
export const getWorkspaceRoleLabel = (role?: WorkspaceRole | null): string => {
  if (!role) return ''
  return WORKSPACE_ROLE_CONFIG[role]?.label || role
}

/**
 * Retourne le libellé d'un statut.
 */
export const getWorkspaceStatusLabel = (status?: WorkspaceStatus | null): string => {
  if (!status) return ''
  return WORKSPACE_STATUS_CONFIG[status]?.label || status
}

/**
 * Résout l'URL du logo d'un workspace. Utilise Dicebear shapes en fallback.
 */
export const getWorkspaceLogoUrl = (
  logoUrl: string | null | undefined,
  workspaceName?: string | null
): string => {
  if (logoUrl && logoUrl.trim() !== '') {
    if (logoUrl.startsWith('http')) return logoUrl
    const cleanPath = logoUrl.replace(/^\/+/, '').replace(/^uploads\//i, '').replace(/^\/+/, '')
    return `/uploads/${cleanPath}`
  }

  const seed = workspaceName?.trim() || 'Workspace'
  return `https://api.dicebear.com/9.x/icons/svg?seed=${encodeURIComponent(seed)}`
}
