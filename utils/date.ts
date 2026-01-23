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
