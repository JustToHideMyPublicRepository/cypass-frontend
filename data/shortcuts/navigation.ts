import type { ShortcutEntry } from './index'

export const navigationShortcuts: Record<string, ShortcutEntry> = {
  scroll_bottom: {
    keys: ['↓'],
    label: 'Aller en bas de la page',
    isGlobal: false,
    group: 'Navigation',
    modifier: 'Shift'
  },
  scroll_top: {
    keys: ['↑'],
    label: 'Aller en haut de la page',
    isGlobal: false,
    group: 'Navigation',
    modifier: 'Shift'
  },
  history_back: {
    keys: ['←'],
    label: 'Page précédente',
    isGlobal: false,
    group: 'Navigation',
    modifier: 'Shift'
  },
  history_forward: {
    keys: ['→'],
    label: 'Page suivante',
    isGlobal: false,
    group: 'Navigation',
    modifier: 'Shift'
  },
}
