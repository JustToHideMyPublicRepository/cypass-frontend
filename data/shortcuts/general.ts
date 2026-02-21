import type { ShortcutEntry } from './index'

export const generalShortcuts: Record<string, ShortcutEntry> = {
  help: {
    keys: ['?'],
    label: 'Aide et raccourcis',
    path: '/system/shortcuts',
    isGlobal: true,
    group: 'Général'
  },
  toggle_help_modal: {
    keys: [' '],
    label: 'Afficher l\'aide rapide (Overlay)',
    isGlobal: true,
    group: 'Général'
  }
}
