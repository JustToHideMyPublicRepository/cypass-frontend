import { IconFileText, IconAlertTriangle, IconMessage, IconActivity, IconDeviceDesktop } from '@tabler/icons-vue'

export const CALENDAR_FILTERS = [
  {
    id: 'docsentry',
    label: 'Docsentry',
    icon: IconFileText,
    classes: {
      text: 'text-primary',
      bgLight: 'bg-primary/10',
      peerCheckedBg: 'peer-checked:bg-primary',
      peerCheckedBorder: 'peer-checked:border-primary',
      groupHoverBorder: 'group-hover:border-primary/50'
    }
  },
  {
    id: 'vigitech',
    label: 'Vigitech',
    icon: IconAlertTriangle,
    classes: {
      text: 'text-danger',
      bgLight: 'bg-danger/10',
      peerCheckedBg: 'peer-checked:bg-danger',
      peerCheckedBorder: 'peer-checked:border-danger',
      groupHoverBorder: 'group-hover:border-danger/50'
    }
  },
  {
    id: 'comment',
    label: 'Commentaires',
    icon: IconMessage,
    classes: {
      text: 'text-warning',
      bgLight: 'bg-warning/10',
      peerCheckedBg: 'peer-checked:bg-warning',
      peerCheckedBorder: 'peer-checked:border-warning',
      groupHoverBorder: 'group-hover:border-warning/50'
    }
  },
  {
    id: 'log',
    label: 'Traces d\'activité',
    icon: IconActivity,
    classes: {
      text: 'text-hsa',
      bgLight: 'bg-hsa/10',
      peerCheckedBg: 'peer-checked:bg-hsa',
      peerCheckedBorder: 'peer-checked:border-hsa',
      groupHoverBorder: 'group-hover:border-hsa/50'
    }
  },
  {
    id: 'session',
    label: 'Sessions auth',
    icon: IconDeviceDesktop,
    classes: {
      text: 'text-success',
      bgLight: 'bg-success/10',
      peerCheckedBg: 'peer-checked:bg-success',
      peerCheckedBorder: 'peer-checked:border-success',
      groupHoverBorder: 'group-hover:border-success/50'
    }
  }
] as const

export const getCalendarFilterConfig = (id: string) => {
  return CALENDAR_FILTERS.find(f => f.id === id)
}
