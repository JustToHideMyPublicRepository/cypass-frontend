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
