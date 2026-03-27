import { IconCheck, IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconSearch, IconEye, IconCalendar, IconShieldLock, IconTool } from '@tabler/icons-vue'

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
  'maintenance': {
    label: 'Maintenance',
    color: 'text-blue-500',
    dot: 'bg-blue-500',
    shadow: '0 0 8px rgba(59,130,246,0.6)',
    level: 1,
    icon: IconTool,
    message: 'Maintenance en cours',
    borderColor: 'border-blue-500',
    shadowColor: 'shadow-blue-500/10',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-500'
  },
  'planned': {
    label: 'Planifié',
    color: 'text-purple-500',
    dot: 'bg-purple-500',
    shadow: '0 0 8px rgba(168,85,247,0.6)',
    level: 1,
    icon: IconCalendar,
    message: 'Intervention planifiée',
    borderColor: 'border-purple-500',
    shadowColor: 'shadow-purple-500/10',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-500'
  },
  'security': {
    label: 'Sécurité',
    color: 'text-indigo-500',
    dot: 'bg-indigo-500',
    shadow: '0 0 8px rgba(99,102,241,0.6)',
    level: 2,
    icon: IconShieldLock,
    message: 'Intervention de sécurité',
    borderColor: 'border-indigo-500',
    shadowColor: 'shadow-indigo-500/10',
    bgColor: 'bg-indigo-500/20',
    textColor: 'text-indigo-500'
  },
  'outage': {
    label: 'Panne majeure',
    color: 'text-danger',
    dot: 'bg-danger',
    shadow: '0 0 8px rgba(239,68,68,0.6)',
    level: 3,
    icon: IconAlertCircle,
    message: 'Interruption de service',
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
  'scheduled': {
    label: 'Planifié',
    icon: IconCalendar,
    colorClass: 'text-purple-500'
  },
  'default': {
    label: 'Inconnu',
    icon: IconInfoCircle,
    colorClass: 'text-hsa'
  }
}

export const getStatusInfo = (status: string) => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['outage']
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
  if (maxLevel === 2) return { ...getStatusInfo('security'), globalLabel: 'Perturbé' }
  return { ...getStatusInfo('outage'), globalLabel: 'Critique' }
}
