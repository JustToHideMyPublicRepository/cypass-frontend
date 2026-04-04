import type { ShortcutEntry } from './index'

export const actionShortcuts: Record<string, ShortcutEntry> = {
  help: {
    keys: ['?'],
    label: 'Aide et raccourcis',
    path: '/system/shortcuts',
    isGlobal: true,
    group: 'Actions',
  },
  toggle_help_modal: {
    keys: [' '],
    label: 'Aide rapide',
    isGlobal: true,
    group: 'Actions',
  },
  toggle_theme: {
    keys: ['l'],
    label: 'Changer le thème',
    isGlobal: true,
    group: 'Actions',
    modifier: 'Ctrl + Shift'
  },
  logout: {
    keys: ['d'],
    label: 'Déconnexion',
    isGlobal: true,
    group: 'Actions',
    modifier: 'Ctrl + Shift'
  },
  search_global: {
    keys: ['k'],
    label: 'Recherche globale',
    isGlobal: true,
    group: 'Actions',
    modifier: 'Ctrl + Shift'
  },
  search_local: {
    keys: ['k'],
    label: 'Rechercher sur la page',
    isGlobal: false,
    group: 'Actions',
    modifier: 'Ctrl'
  },
}
