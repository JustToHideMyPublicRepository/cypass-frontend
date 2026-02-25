export const formatDate = (date: string | Date): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const formatTime = (date: string | Date): string => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateInput = (date: string | Date): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return "À l'instant"

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `il y a ${diffInHours} h`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "hier"
  if (diffInDays < 7) return `il y a ${diffInDays} j`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `il y a ${diffInWeeks} sem`

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `il y a ${diffInMonths} mois`

  const diffInYears = Math.floor(diffInDays / 365)
  return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`
}

/**
 * Génère une date aléatoire dans le passé entre minDays et maxDays.
 */
export const getRandomPastDate = (minDays = 5, maxDays = 21): Date => {
  const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays
  const date = new Date()
  date.setDate(date.getDate() - days)

  // Optionnel: On peut aussi mettre une heure aléatoire
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))

  return date
}
