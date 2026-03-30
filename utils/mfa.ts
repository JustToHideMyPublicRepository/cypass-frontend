import { IconDialpad, IconMailFast, IconPasswordMobilePhone, IconPasswordFingerprint, IconPasswordUser, IconLock } from '@tabler/icons-vue'

export const MFA_METHODS_CONFIG = {
  totp: {
    label: 'Code par email',
    icon: IconDialpad,
    color: 'text-primary',
    bg: 'bg-primary/10',
    description: 'Recevez un code à usage unique sur votre adresse email de contact.',
    recommendation: 'Simple et accessible partout, mais moins sécurisé que les méthodes hors-ligne.'
  },
  magic_link: {
    label: 'Lien magique',
    icon: IconMailFast,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    description: 'Connectez-vous via un lien sécurisé envoyé par email.',
    recommendation: 'Pratique mais nécessite un accès permanent à votre boîte mail.'
  },
  authenticator: {
    label: 'Application authenticator',
    icon: IconPasswordMobilePhone,
    color: 'text-success',
    bg: 'bg-success/10',
    description: 'Générez des codes via une application mobile (Google/Microsoft Authenticator).',
    recommendation: 'Très sécurisé car les codes sont générés localement sur votre téléphone.'
  },
  passkey: {
    label: 'Passkey (Clé de sécurité)',
    icon: IconPasswordFingerprint,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    description: 'Utilisez la biométrie ou une clé USB matérielle.',
    recommendation: 'La méthode la plus avancée et résistante à toutes les tentatives de phishing.'
  },
  security_code: {
    label: 'Code de sécurité',
    icon: IconPasswordUser,
    color: 'text-warning',
    bg: 'bg-warning/10',
    description: 'Utilisez des codes de secours pré-générés.',
    recommendation: 'Solution ultime si vous perdez l\'accès à vos autres méthodes. À garder précieusement.'
  }
} as const

export const getMfaMethodInfo = (method: string) => {
  return MFA_METHODS_CONFIG[method as keyof typeof MFA_METHODS_CONFIG] || {
    label: method,
    icon: IconLock,
    color: 'text-hsa',
    bg: 'bg-ash',
    description: 'Méthode d\'authentification supplémentaire.',
    recommendation: 'Assurez-vous que cette méthode est bien configurée.'
  }
}
