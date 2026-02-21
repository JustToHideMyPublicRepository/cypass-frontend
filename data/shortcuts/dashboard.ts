import type { ShortcutEntry } from './index'

export const dashboardShortcuts: Record<string, ShortcutEntry> = {
  dashboard_home: {
    keys: ['d', 'i'],
    label: 'Tableau de bord',
    path: '/dashboard',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  docsentry: {
    keys: ['d', 'd'],
    label: 'Docsentry',
    path: '/dashboard/docsentry',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  logs: {
    keys: ['d', 'l'],
    label: 'Journal d\'activité',
    path: '/dashboard/logs',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  notification: {
    keys: ['d', 'n'],
    label: 'Notification',
    path: '/dashboard/notifications',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  profile: {
    keys: ['d', 'p'],
    label: 'Mon Profil',
    path: '/dashboard/profile',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  sessions: {
    keys: ['d', 's'],
    label: 'Sessions actives',
    path: '/dashboard/sessions',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  settings: {
    keys: ['d', 't'],
    label: 'Paramètres',
    path: '/dashboard/settings',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  vigitech: {
    keys: ['d', 'v'],
    label: 'Vigitech',
    path: '/dashboard/vigitech',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  }
}
