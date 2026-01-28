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

  return {
    getCategory,
    getTypeIcon,
    getTypeStyles,
    getCategoryLabel
  }
}
