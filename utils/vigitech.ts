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
