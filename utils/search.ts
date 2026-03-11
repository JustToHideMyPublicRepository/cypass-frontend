import {
  IconKeyboard, IconLayoutDashboard, IconFileDescription,
  IconAlertTriangle, IconShieldCheck, IconActivity, IconSearch,
  IconQuestionMark, IconLifebuoy
} from '@tabler/icons-vue'

/**
 * Retourne l'icône correspondant au type de résultat de recherche.
 */
export const getSearchIcon = (type: string) => {
  switch (type) {
    case 'shortcuts': return IconKeyboard
    case 'navigation': return IconLayoutDashboard
    case 'docsentry': return IconFileDescription
    case 'vigitech': return IconShieldCheck
    case 'incident': return IconAlertTriangle
    case 'log': return IconActivity
    case 'faq': return IconQuestionMark
    case 'support': return IconLifebuoy
    default: return IconSearch
  }
}

/**
 * Retourne la couleur de fond et de texte correspondante au type.
 */
export const getSearchIconStyle = (type: string) => {
  switch (type) {
    case 'shortcuts': return 'bg-slate-500/10 text-slate-500'
    case 'navigation': return 'bg-blue-500/10 text-blue-500'
    case 'docsentry': return 'bg-orange-500/10 text-orange-500'
    case 'vigitech': return 'bg-emerald-500/10 text-emerald-500'
    case 'incident': return 'bg-red-500/10 text-red-500'
    case 'log': return 'bg-purple-500/10 text-purple-500'
    case 'faq': return 'bg-yellow-500/10 text-yellow-500'
    case 'support': return 'bg-rose-500/10 text-rose-500'
    default: return 'bg-ash/10 text-hsa'
  }
}
/**
 * Configuration pour les placeholders tournants
 */
export const PLACEHOLDER_INTERVAL = 3000 // 3 secondes

export const searchPlaceholders = [
  'Trouver un document...',
  'Vérifier un certificat...',
  'Rechercher une alerte...',
  'Rechercher une page...',
  'Trouver de l\'aide...',
  'Paramètres système...',
  'Historique des scans...',
  'Support technique...'
]
