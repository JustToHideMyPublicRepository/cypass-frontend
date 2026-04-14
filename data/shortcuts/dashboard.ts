import type { ShortcutEntry } from './index'

export const dashboardShortcuts: Record<string, ShortcutEntry> = {
  calendar: {
    keys: ['d', 'c'],
    label: 'Calendrier',
    path: '/dashboard/calendar',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  reports: {
    keys: ['d', 'r'],
    label: 'Centre d\'alertes',
    path: '/dashboard/reports',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  vigitech_comment: {
    keys: ['d', 'm'],
    label: 'Commentaires',
    path: '/dashboard/vigitech/comments',
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
  billing: {
    keys: ['d', 'b'],
    label: 'Facturation',
    path: '/dashboard/billing',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  logs: {
    keys: ['d', 'l'],
    label: 'Journal d\'activité',
    path: '/dashboard/activities',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  notification: {
    keys: ['d', 'n'],
    label: 'Notification',
    path: '/dashboard/notification',
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
  profile: {
    keys: ['d', 'p'],
    label: 'Profil',
    path: '/dashboard/profile',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  security: {
    keys: ['d', 'y'],
    label: 'Sécurité',
    path: '/dashboard/security',
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
  dashboard_home: {
    keys: ['d', 'i'],
    label: 'Tableau de bord',
    path: '/dashboard',
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
  },
}
