import { IconCheck, IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconSearch, IconEye } from '@tabler/icons-vue'

export const STATUS_CONFIG = {
  'operational': {
    label: 'Opérationnel',
    color: 'text-success',
    dot: 'bg-success',
    shadow: '0 0 8px rgba(34,197,94,0.6)',
    level: 0,
    icon: IconCheck,
    message: 'Tous les systèmes sont opérationnels',
    borderColor: 'border-success',
    shadowColor: 'shadow-success/10',
    bgColor: 'bg-success/20',
    textColor: 'text-success'
  },
  'degraded': {
    label: 'Performance dégradée',
    color: 'text-warning',
    dot: 'bg-warning',
    shadow: '0 0 8px rgba(249,115,22,0.6)',
    level: 1,
    icon: IconInfoCircle,
    message: 'Certains services sont ralentis',
    borderColor: 'border-warning',
    shadowColor: 'shadow-warning/10',
    bgColor: 'bg-warning/20',
    textColor: 'text-warning'
  },
  'partial_outage': {
    label: 'Interruption partielle',
    color: 'text-orange-500',
    dot: 'bg-orange-500',
    shadow: '0 0 8px rgba(249,115,22,0.6)',
    level: 2,
    icon: IconAlertTriangle,
    message: 'Interruption partielle de service',
    borderColor: 'border-orange-500',
    shadowColor: 'shadow-orange-500/10',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-500'
  },
  'major_incident': {
    label: 'Incident majeur',
    color: 'text-danger',
    dot: 'bg-danger',
    shadow: '0 0 8px rgba(239,68,68,0.6)',
    level: 3,
    icon: IconAlertCircle,
    message: 'Incident majeur en cours',
    borderColor: 'border-danger',
    shadowColor: 'shadow-danger/10',
    bgColor: 'bg-danger/20',
    textColor: 'text-danger'
  }
} as const

export const INCIDENT_STATUS_CONFIG = {
  'resolved': {
    label: 'Résolu',
    icon: IconCheck,
    colorClass: 'text-success'
  },
  'investigating': {
    label: 'En cours d\'investigation',
    icon: IconSearch,
    colorClass: 'text-warning'
  },
  'identified': {
    label: 'Identifié',
    icon: IconAlertTriangle,
    colorClass: 'text-orange-500'
  },
  'monitoring': {
    label: 'Sous surveillance',
    icon: IconEye,
    colorClass: 'text-info'
  },
  'default': {
    label: 'Inconnu',
    icon: IconInfoCircle,
    colorClass: 'text-hsa'
  }
}

export const getStatusInfo = (status: string) => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['major_incident']
}

export const getIncidentStatusInfo = (status: string = 'default') => {
  return INCIDENT_STATUS_CONFIG[status as keyof typeof INCIDENT_STATUS_CONFIG] || INCIDENT_STATUS_CONFIG['default']
}

export const getGlobalStatus = (components: { status: string }[]) => {
  if (components.length === 0) return null

  const levels = components.map(c => getStatusInfo(c.status).level)
  const maxLevel = Math.max(...levels)

  if (maxLevel === 0) return { ...getStatusInfo('operational'), globalLabel: 'Opérationnel' }
  if (maxLevel === 1) return { ...getStatusInfo('degraded'), globalLabel: 'Ralenti' }
  if (maxLevel === 2) return { ...getStatusInfo('partial_outage'), globalLabel: 'Perturbé' }
  return { ...getStatusInfo('major_incident'), globalLabel: 'Critique' }
}
