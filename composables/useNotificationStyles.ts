import { IconFileText, IconShieldLock, IconUser, IconCircleCheck, IconAlertTriangle, IconInfoCircle, IconShieldCheck, IconShieldExclamation, IconTrash, IconLock, IconMail, IconAlertOctagon, IconMessageReport } from '@tabler/icons-vue'

export type NotificationCategory = 'DOC' | 'SEC' | 'INC' | 'PRF' | 'OTHER'

export const useNotificationStyles = () => {
  /**
   * Détermine la catégorie principale d'une notification
   */
  const getCategory = (type: string): NotificationCategory => {
    if (type.startsWith('DOC_')) return 'DOC'
    if (type.startsWith('SEC_')) return 'SEC'
    if (type.startsWith('INC_')) return 'INC'
    if (type.startsWith('PRF_')) return 'PRF'
    return 'OTHER'
  }

  /**
   * Récupère l'icône correspondante au type de notification
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOC_SUCCESS':
      case 'DOC_CERTIFIED': return IconCircleCheck
      case 'DOC_FAILURE': return IconAlertTriangle
      case 'SEC_LOGIN': return IconShieldCheck
      case 'SEC_NEW_IP': return IconShieldExclamation
      case 'SEC_DEL_CNCL': return IconTrash
      case 'SEC_PWD_CHG': return IconLock
      case 'PRF_MFA_TGL': return IconShieldLock
      case 'PRF_AVATAR': return IconUser
      case 'PRF_UPDATE': return IconUser
      case 'PRF_EML_VFD': return IconMail
      case 'INC_CREATED': return IconAlertOctagon
      case 'INC_COMMENT': return IconMessageReport
      default:
        const cat = getCategory(type)
        if (cat === 'DOC') return IconFileText
        if (cat === 'SEC') return IconShieldLock
        if (cat === 'INC') return IconAlertOctagon
        if (cat === 'PRF') return IconUser
        return IconInfoCircle
    }
  }

  /**
   * Récupère les classes de style (couleurs) pour un type donné
   */
  const getTypeStyles = (type: string) => {
    const category = getCategory(type)
    switch (category) {
      case 'DOC':
        return type === 'DOC_FAILURE'
          ? 'bg-red-500/10 text-red-500'
          : 'bg-green-500/10 text-green-500'
      case 'SEC':
        return 'bg-amber-500/10 text-amber-600'
      case 'INC':
        return 'bg-rose-500/10 text-rose-500'
      case 'PRF':
        return 'bg-blue-500/10 text-blue-500'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  /**
   * Retourne le libellé de la catégorie
   */
  const getCategoryLabel = (category: NotificationCategory) => {
    switch (category) {
      case 'DOC': return 'Documents'
      case 'SEC': return 'Sécurité'
      case 'INC': return 'Incidents'
      case 'PRF': return 'Profil'
      default: return 'Général'
    }
  }

  /**
   * Génère un message détaillé pour les notifications de sécurité
   */
  const getSecurityMessage = (type: string) => {
    if (type === 'SEC_LOGIN') {
      return "Si vous ne reconnaissez pas cette activité de connexion, nous vous recommandons de changer votre mot de passe immédiatement dans l'onglet Sécurité et de déconnecter les autres sessions."
    }
    if (type === 'SEC_NEW_IP') {
      return "Une connexion depuis une nouvelle adresse IP a été détectée. Si ce n'est pas vous, changez immédiatement votre mot de passe."
    }
    if (type === 'SEC_PWD_CHG') {
      return "Le mot de passe de votre compte a été modifié. Si vous n'êtes pas à l'origine de cette action, votre compte est peut-être compromis."
    }
    if (type === 'SEC_DEL_CNCL') {
      return "La suppression de votre compte a été annulée. Aucune action supplémentaire n'est requise."
    }
    if (type === 'PRF_MFA_TGL') {
      return "Les paramètres de double authentification de votre compte ont été modifiés."
    }
    return "Une activité liée à la sécurité de votre compte a été détectée. Veuillez vérifier l'historique de vos connexions."
  }

  /**
   * Génère un message détaillé pour les notifications de documents
   */
  const getDocumentMessage = (type: string) => {
    if (type === 'DOC_SUCCESS') {
      return "Votre document a été traité et vérifié avec succès. Vous pouvez maintenant consulter le certificat associé."
    }
    if (type === 'DOC_FAILURE') {
      return "Le traitement de votre document a échoué. Veuillez vérifier l'intégrité du fichier ou contacter le support technique."
    }
    return "Nouvelle activité enregistrée dans votre coffre-fort numérique DocSentry."
  }

  /**
   * Génère un message détaillé pour les notifications d'incidents
   */
  const getIncidentMessage = (type: string) => {
    if (type === 'INC_CREATED') {
      return "Un nouvel incident a été signalé. Consultez les détails pour prendre les mesures appropriées."
    }
    if (type === 'INC_COMMENT') {
      return "Un nouveau commentaire a été ajouté à un incident que vous suivez."
    }
    return "Nouvelle activité liée aux incidents VigiTech."
  }

  /**
   * Génère un message détaillé pour les notifications de profil
   */
  const getProfileMessage = (type: string) => {
    if (type === 'PRF_AVATAR') {
      return "Votre photo de profil a été mise à jour avec succès. Elle est désormais visible sur votre compte."
    }
    if (type === 'PRF_UPDATE') {
      return "Vos informations de profil ont été mises à jour avec succès."
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
    getIncidentMessage,
    getProfileMessage
  }
}
