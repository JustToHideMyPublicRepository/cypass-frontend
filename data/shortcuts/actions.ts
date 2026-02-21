import type { ShortcutEntry } from './index'

export const actionShortcuts: Record<string, ShortcutEntry> = {
  toggle_theme: {
    keys: ['l'],
    label: 'Changer le thème',
    isGlobal: true,
    group: 'Actions',
    modifier: 'Ctrl + Shift'
  },
  scroll_top: {
    keys: ['↑'],
    label: 'Aller en haut de la page',
    isGlobal: false,
    group: 'Actions',
    modifier: 'Shift'
  },
  scroll_bottom: {
    keys: ['↓'],
    label: 'Aller en bas de la page',
    isGlobal: false,
    group: 'Actions',
    modifier: 'Shift'
  },
  history_back: {
    keys: ['←'],
    label: 'Page précédente',
    isGlobal: false,
    group: 'Actions',
    modifier: 'Shift'
  },
  history_forward: {
    keys: ['→'],
    label: 'Page suivante',
    isGlobal: false,
    group: 'Actions',
    modifier: 'Shift'
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
  logout: {
    keys: ['d'],
    label: 'Déconnexion',
    isGlobal: true,
    group: 'Actions',
    modifier: 'Ctrl + Shift'
  }
}
