export interface SecurityMetricData {
  documentsCount: number
  criticalIncidents: number
  mediumIncidents: number
  failedLogins: number
  otherFailures: number
  activeSessions: number
}

export interface SecurityScoreResult {
  score: number
  grade: string
  label: string
  color: string
}

export const calculateSecurityScore = (data: SecurityMetricData): SecurityScoreResult => {
  let score = 100

  // 1. Critical Incidents (-10 per incident)
  score -= data.criticalIncidents * 10

  // 2. Medium Incidents (-5 per incident)
  score -= data.mediumIncidents * 5

  // 3. Failed Logins (-15 per failed login)
  score -= data.failedLogins * 15

  // 4. Other Failures (-3 per failure)
  score -= data.otherFailures * 3

  // 5. Active Sessions hygiene (-5 for each session > 3)
  if (data.activeSessions > 3) {
    score -= (data.activeSessions - 3) * 5
  }

  // 6. Documents bonus (+2 per document, max +20)
  const docBonus = Math.min(20, data.documentsCount * 2)
  score += docBonus

  // Ensure score is within [0, 100]
  score = Math.min(100, Math.max(0, score))

  // Determine Grade
  let grade = 'D'
  let label = 'Risqué'
  let color = 'text-danger'

  if (score >= 90) {
    grade = 'A+'
    label = 'Excellent'
    color = 'text-success'
  } else if (score >= 80) {
    grade = 'A'
    label = 'Très bon'
    color = 'text-success'
  } else if (score >= 70) {
    grade = 'B'
    label = 'Bon'
    color = 'text-warning'
  } else if (score >= 60) {
    grade = 'C'
    label = 'Moyen'
    color = 'text-warning'
  }

  return { score, grade, label, color }
}
