import { IconFileText, IconShieldLock, IconUser, IconCircleCheck, IconAlertTriangle, IconInfoCircle, IconShieldCheck, IconShieldExclamation, IconTrash, IconLock, IconMail } from '@tabler/icons-vue'

export type NotificationCategory = 'DOC' | 'SEC' | 'PRF' | 'OTHER'

export const useNotificationStyles = () => {
  const getCategory = (type: string): NotificationCategory => {
    if (type.startsWith('DOC_')) return 'DOC'
    if (type.startsWith('SEC_')) return 'SEC'
    if (type.startsWith('PRF_')) return 'PRF'
    return 'OTHER'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOC_SUCCESS':
      case 'DOC_CERTIFIED': return IconCircleCheck
      case 'DOC_FAILURE': return IconAlertTriangle
      case 'SEC_LOGIN': return IconShieldCheck
      case 'SEC_DEL_CNCL': return IconTrash
      case 'SEC_PWD_CHG': return IconLock
      case 'PRF_AVATAR': return IconUser
      case 'PRF_EML_VFD': return IconMail
      default:
        const cat = getCategory(type)
        if (cat === 'DOC') return IconFileText
        if (cat === 'SEC') return IconShieldLock
        if (cat === 'PRF') return IconUser
        return IconInfoCircle
    }
  }

  const getTypeStyles = (type: string) => {
    const category = getCategory(type)
    switch (category) {
      case 'DOC':
        return type === 'DOC_FAILURE'
          ? 'bg-red-500/10 text-red-500'
          : 'bg-green-500/10 text-green-500'
      case 'SEC':
        return 'bg-amber-500/10 text-amber-600'
      case 'PRF':
        return 'bg-blue-500/10 text-blue-500'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  const getCategoryLabel = (category: NotificationCategory) => {
    switch (category) {
      case 'DOC': return 'Documents'
      case 'SEC': return 'Sécurité'
      case 'PRF': return 'Profil'
      default: return 'Général'
    }
  }

  const getSecurityMessage = (type: string) => {
    if (type === 'SEC_LOGIN') {
      return "Si vous ne reconnaissez pas cette activité de connexion, nous vous recommandons de changer votre mot de passe immédiatement dans l'onglet Sécurité et de déconnecter les autres sessions."
    }
    if (type === 'SEC_PWD_CHG') {
      return "Le mot de passe de votre compte a été modifié. Si vous n'êtes pas à l'origine de cette action, votre compte est peut-être compromis."
    }
    return "Une activité liée à la sécurité de votre compte a été détectée. Veuillez vérifier l'historique de vos connexions."
  }

  const getDocumentMessage = (type: string) => {
    if (type === 'DOC_SUCCESS') {
      return "Votre document a été traité et vérifié avec succès. Vous pouvez maintenant consulter le certificat associé."
    }
    if (type === 'DOC_FAILURE') {
      return "Le traitement de votre document a échoué. Veuillez vérifier l'intégrité du fichier ou contacter le support technique."
    }
    return "Nouvelle activité enregistrée dans votre coffre-fort numérique DocSentry."
  }

  const getProfileMessage = (type: string) => {
    if (type === 'PRF_AVATAR') {
      return "Votre photo de profil a été mise à jour avec succès. Elle est désormais visible sur votre compte."
    }
    if (type === 'PRF_EML_VFD') {
      return "Votre adresse email a été vérifiée. Votre compte est désormais pleinement sécurisé."
    }
    return "Votre profil a été mis à jour avec de nouveaux paramètres. Assurez-vous que vos informations sont toujours correctes."
  }

  return {
    getCategory,
    getTypeIcon,
    getTypeStyles,
    getCategoryLabel,
    getSecurityMessage,
    getDocumentMessage,
    getProfileMessage
  }
}
