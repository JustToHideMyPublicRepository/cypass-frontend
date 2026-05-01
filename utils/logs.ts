import {
  IconLogin, IconLogout, IconLock, IconMail, IconUser, IconPhotoEdit,
  IconShieldLock, IconAlertTriangle, IconBug, IconExchange, IconActivity,
  IconFingerprint, IconAlertCircle, IconTrash, IconUserPlus, IconMailCheck,
  IconKey, IconDevicesPc, IconEye, IconFileUpload, IconFileDownload,
  IconFileCheck, IconFileX, IconUrgent, IconGavel, IconRefresh,
  IconSettings, IconPhotoCancel, IconUserEdit, IconCreditCard, IconCoins
} from '@tabler/icons-vue'

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
  // ── Authentification ──────────────────────────────────────
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
  'USER_REGISTERED': {
    label: 'Inscription',
    icon: IconUserPlus,
    color: 'text-success'
  },
  'EMAIL_VERIFIED': {
    label: 'Email vérifié',
    icon: IconMailCheck,
    color: 'text-success'
  },
  'TOKEN_CREATED': {
    label: 'Jeton d\'authentification créé',
    icon: IconFingerprint,
    color: 'text-primary'
  },
  'ALL_TOKENS_REVOKED': {
    label: 'Tous les jetons révoqués',
    icon: IconKey,
    color: 'text-warning'
  },
  'ALL_SESSIONS_REVOKED': {
    label: 'Toutes les autres sessions révoquées',
    icon: IconDevicesPc,
    color: 'text-warning'
  },
  'SESSION_REVOKED': {
    label: 'Session révoquée',
    icon: IconDevicesPc,
    color: 'text-warning'
  },

  // ── Profil ────────────────────────────────────────────────
  'PASSWORD_CHANGED': {
    label: 'Modification du mot de passe',
    icon: IconLock,
    color: 'text-warning'
  },
  'FAILED_PASSWORD_CHANGE': {
    label: 'Échec modification du mot de passe',
    icon: IconLock,
    color: 'text-danger'
  },
  'EMAIL_CHANGED': {
    label: 'Modification de l\'email',
    icon: IconMail,
    color: 'text-warning'
  },
  'FAILED_EMAIL_CHANGE': {
    label: 'Échec modification de l\'email',
    icon: IconMail,
    color: 'text-danger'
  },
  'PROFILE_UPDATE': {
    label: 'Mise à jour du profil',
    icon: IconUserEdit,
    color: 'text-primary'
  },
  'VIEW_OWN_LOGS': {
    label: 'Consultation de ses logs',
    icon: IconEye,
    color: 'text-primary'
  },
  'AVATAR_UPLOADED': {
    label: 'Mise à jour de la photo de profil',
    icon: IconPhotoEdit,
    color: 'text-hsa'
  },
  'AVATAR_DELETED': {
    label: 'Suppression de la photo de profil',
    icon: IconPhotoCancel,
    color: 'text-danger'
  },

  // ── MFA ───────────────────────────────────────────────────
  'MFA_ENABLED': {
    label: 'Activation de la MFA',
    icon: IconShieldLock,
    color: 'text-success'
  },
  'MFA_DISABLED': {
    label: 'Désactivation de la MFA',
    icon: IconShieldLock,
    color: 'text-warning'
  },
  'FAILED_MFA_TOGGLE': {
    label: 'Échec de modification de la MFA',
    icon: IconShieldLock,
    color: 'text-danger'
  },
  'MFA_VERIFIED': {
    label: 'Vérification MFA réussie',
    icon: IconShieldLock,
    color: 'text-success'
  },
  'MFA_TEMP_DISABLED': {
    label: 'Désactivation temporaire de la MFA',
    icon: IconShieldLock,
    color: 'text-warning'
  },

  // ── Documents ─────────────────────────────────────────────
  'DOCUMENT_UPLOADED': {
    label: 'Téléchargement de document',
    icon: IconFileUpload,
    color: 'text-info'
  },
  'DOCUMENT_DOWNLOADED': {
    label: 'Téléchargement de document',
    icon: IconFileDownload,
    color: 'text-info'
  },
  'DOCUMENT_AUTHENTICATED': {
    label: 'Authentification de document',
    icon: IconFileCheck,
    color: 'text-success'
  },
  'DOCUMENT_DELETED': {
    label: 'Suppression de document',
    icon: IconFileX,
    color: 'text-danger'
  },
  'DOCUMENT_UPLOAD_FAILED': {
    label: 'Échec de téléchargement de document',
    icon: IconFileX,
    color: 'text-danger'
  },
  'MULTI_VERSION_UPLOAD_FAILED': {
    label: 'Échec de téléchargement multi-versions',
    icon: IconFileX,
    color: 'text-danger'
  },
  'MULTI_VERSION_UPLOAD_SUCCESS': {
    label: 'Téléchargement multi-versions réussi',
    icon: IconFileCheck,
    color: 'text-success'
  },
  'ENRICHED_DOCUMENT_UPLOADED': {
    label: 'Certification enrichie réussie',
    icon: IconFileCheck,
    color: 'text-success'
  },
  'ENRICHED_UPLOAD_FAILED': {
    label: 'Échec de certification enrichie',
    icon: IconFileX,
    color: 'text-danger'
  },

  // ── VigiTech ──────────────────────────────────────────────
  'INCIDENT_CREATED': {
    label: 'Création d\'incident',
    icon: IconUrgent,
    color: 'text-warning'
  },
  'INCIDENT_MODERATED': {
    label: 'Modération d\'incident',
    icon: IconGavel,
    color: 'text-info'
  },
  'INCIDENT_UPDATED': {
    label: 'Mise à jour d\'incident',
    icon: IconRefresh,
    color: 'text-primary'
  },

  // ── Admin ─────────────────────────────────────────────────
  'VIEW_LOGS': {
    label: 'Consultation des logs (admin)',
    icon: IconEye,
    color: 'text-primary'
  },
  'ADMIN_ACTION': {
    label: 'Action administrateur',
    icon: IconSettings,
    color: 'text-primary'
  },

  // ── Sécurité ──────────────────────────────────────────────
  'LOGIN_FAILED': {
    label: 'Tentative de connexion échouée',
    icon: IconAlertTriangle,
    color: 'text-danger'
  },
  'INVALID_TOKEN': {
    label: 'Jeton invalide',
    icon: IconBug,
    color: 'text-danger'
  },
  'UNAUTHORIZED_ACCESS': {
    label: 'Accès non autorisé',
    icon: IconShieldLock,
    color: 'text-danger'
  },
  'SUSPICIOUS_ACTIVITY': {
    label: 'Activité suspecte détectée',
    icon: IconAlertTriangle,
    color: 'text-danger'
  },

  // ── Compte ────────────────────────────────────────────────
  'ACCOUNT_DELETION_REQUESTED': {
    label: 'Demande de suppression de compte',
    icon: IconTrash,
    color: 'text-danger'
  },
  'FAILED_DELETE_AUTH': {
    label: 'Tentative de suppression de compte échouée',
    icon: IconTrash,
    color: 'text-danger'
  },

  // ── Paiements ──────────────────────────────────────────────
  'PAYMENT_SUCCESS': {
    label: 'Paiement réussi',
    icon: IconCreditCard,
    color: 'text-success'
  },
  'PAYMENT_FAILED': {
    label: 'Paiement échoué',
    icon: IconCreditCard,
    color: 'text-danger'
  },
  'CREDITS_ADDED': {
    label: 'Crédits ajoutés au compte',
    icon: IconCoins,
    color: 'text-success'
  },

  // ── Générique / Défaut ────────────────────────────────────
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

export const getLogActionInfo = (action_type: string) => {
  const upperAction = action_type?.toUpperCase() || ''
  return ACTION_MAPPINGS[upperAction] || ACTION_MAPPINGS['DEFAULT']
}

export const getLogTypeInfo = (type: string) => {
  return LOG_TYPES[type as LogTypeKey] || LOG_TYPES['user_actions']
}
