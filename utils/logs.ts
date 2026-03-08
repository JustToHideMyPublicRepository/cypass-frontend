import { IconLogin, IconLogout, IconLock, IconMail, IconUser, IconPhoto, IconShieldLock, IconAlertTriangle, IconBug, IconExchange, IconActivity, IconFingerprint, IconAlertCircle, IconTrash } from '@tabler/icons-vue'

export const LOG_TYPES = {
  user_actions: {
    label: 'Activités utilisateur',
    icon: IconUser,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  security: {
    label: 'Sécurité',
    icon: IconShieldLock,
    color: 'text-danger',
    bgColor: 'bg-danger/10'
  },
  requests: {
    label: 'Requêtes API',
    icon: IconExchange,
    color: 'text-info',
    bgColor: 'bg-info/10'
  },
  errors: {
    label: 'Erreurs système',
    icon: IconBug,
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  }
} as const

export type LogTypeKey = keyof typeof LOG_TYPES

export const ACTION_MAPPINGS: Record<string, { label: string, icon: any, color: string }> = {
  // Authentication
  'USER_LOGIN': {
    label: 'Connexion réussie',
    icon: IconLogin,
    color: 'text-success'
  },
  'USER_LOGOUT': {
    label: 'Déconnexion',
    icon: IconLogout,
    color: 'text-hsa'
  },
  'TOKEN_CREATED': {
    label: 'Jeton d\'accès généré',
    icon: IconFingerprint,
    color: 'text-primary'
  },
  'MFA_INITIATED': {
    label: 'MFA initialisée',
    icon: IconShieldLock,
    color: 'text-warning'
  },
  'MFA_TOGGLED': {
    label: 'Double authentification modifiée',
    icon: IconShieldLock,
    color: 'text-primary'
  },

  // Account / Profile
  'PROFILE_UPDATED': {
    label: 'Profil mis à jour',
    icon: IconUser,
    color: 'text-primary'
  },
  'PASSWORD_UPDATED': {
    label: 'Mot de passe modifié',
    icon: IconLock,
    color: 'text-warning'
  },
  'EMAIL_UPDATED': {
    label: 'Email modifié',
    icon: IconMail,
    color: 'text-warning'
  },
  'AVATAR_UPLOADED': {
    label: 'Avatar mis à jour',
    icon: IconPhoto,
    color: 'text-info'
  },
  'AVATAR_DELETED': {
    label: 'Avatar supprimé',
    icon: IconTrash,
    color: 'text-danger'
  },
  'ACCOUNT_DELETED': {
    label: 'Compte supprimé',
    icon: IconTrash,
    color: 'text-danger'
  },

  // Generic / Default
  'DEFAULT': {
    label: 'Action système',
    icon: IconActivity,
    color: 'text-hsa'
  },
  'ERROR': {
    label: 'Erreur détectée',
    icon: IconAlertCircle,
    color: 'text-danger'
  },
  'WARNING': {
    label: 'Avertissement',
    icon: IconAlertTriangle,
    color: 'text-warning'
  }
}

export const getLogActionInfo = (action: string) => {
  const upperAction = action?.toUpperCase() || ''
  return ACTION_MAPPINGS[upperAction] || ACTION_MAPPINGS['DEFAULT']
}

export const getLogTypeInfo = (type: string) => {
  return LOG_TYPES[type as LogTypeKey] || LOG_TYPES['user_actions']
}
