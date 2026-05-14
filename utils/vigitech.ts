/**
 * Mappe les types d'incidents VigiTech en français
 */
export const mapIncidentType = (type: string) => {
  const types: Record<string, string> = {
    phishing: 'Hameçonnage',
    ransomware: 'Rançongiciel',
    fake_profile: 'Usurpation d\'identité',
    harassment: 'Harcèlement en ligne',
    other: 'Autre menace'
  }
  return types[type] || type
}

/**
 * Mappe les niveaux de menace VigiTech en français
 */
export const mapThreatLevel = (level: string) => {
  const levels: Record<string, string> = {
    low: 'Faible',
    medium: 'Moyen',
    critical: 'Critique'
  }
  return levels[level] || level
}

/**
 * Mappe les statuts d'incidents VigiTech en français
 */
export const mapIncidentStatus = (status: string) => {
  const statuses: Record<string, string> = {
    validated: 'Validé',
    rejected: 'Rejeté',
    blocked: 'Bloqué'
  }
  return statuses[status] || status
}

/**
 * Mappe les raisons de signalement VigiTech en français
 */
export const mapReportReason = (reason: string) => {
  const reasons: Record<string, string> = {
    fake_incident: 'Faux incident',
    inappropriate: 'Contenu inapproprié',
    spam: 'Spam',
    other: 'Autre'
  }
  return reasons[reason] || reason
}

/**
 * Mappe les raisons de signalement d'utilisateur
 */
export const mapUserReportReason = (reason: string) => {
  const reasons: Record<string, string> = {
    fake_profile: 'Usurpation d\'identité',
    harassment: 'Harcèlement',
    inappropriate: 'Contenu inapproprié',
    spam: 'Spam',
    other: 'Autre'
  }
  return reasons[reason] || reason
}

/**
 * Liste des raisons de signalement d'incident disponibles
 */
export const reportReasons = [
  { value: 'fake_incident', label: 'Faux incident' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Autre' }
]

/**
 * Liste des raisons de signalement d'utilisateur disponibles
 */
export const userReportReasons = [
  { value: 'fake_profile', label: 'Usurpation d\'identité' },
  { value: 'harassment', label: 'Harcèlement' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Autre' }
]

/**
 * Emojis associés à chaque type de réaction
 */
export const REACTION_EMOJIS: Record<string, string> = {
  love: '❤️',
  like: '👍',
  wow: '😮',
  dislike: '👎',
  sad: '😢'
}

/**
 * Labels français pour chaque type de réaction
 */
export const REACTION_LABELS: Record<string, string> = {
  love: 'J\'adore',
  like: 'J\'aime',
  wow: 'Wow',
  dislike: 'Je n\'aime pas',
  sad: 'Triste'
}

/**
 * Liste ordonnée des types de réactions pour l'itération
 */
export const reactionTypes = ['love', 'like', 'wow', 'dislike', 'sad'] as const

/**
 * Retourne l'emoji pour un type de réaction
 */
export const getReactionEmoji = (type: string): string => {
  return REACTION_EMOJIS[type] || '👍'
}

/**
 * Retourne le label français pour un type de réaction
 */
export const getReactionLabel = (type: string): string => {
  return REACTION_LABELS[type] || type
}

/**
 * Retourne les classes de couleur complètes (fond + texte) pour un type de réaction
 */
export const getReactionColor = (type: string): string => {
  switch (type) {
    case 'love': return 'text-danger bg-danger/5 hover:bg-danger/10'
    case 'like': return 'text-success bg-success/5 hover:bg-success/10'
    case 'wow': return 'text-primary bg-primary/5 hover:bg-primary/10'
    case 'sad': return 'text-warning bg-warning/5 hover:bg-warning/10'
    case 'dislike': return 'text-hsa bg-hsa/5 hover:bg-hsa/10'
    default: return 'text-primary bg-primary/5 hover:bg-primary/10'
  }
}

/**
 * Retourne uniquement les classes de couleur de texte pour un type de réaction
 */
export const getReactionTextColorOnly = (type: string): string => {
  switch (type) {
    case 'love': return 'text-danger'
    case 'like': return 'text-success'
    case 'wow': return 'text-primary'
    case 'sad': return 'text-warning'
    case 'dislike': return 'text-hsa'
    default: return 'text-primary'
  }
}
