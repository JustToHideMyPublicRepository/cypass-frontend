import type { ShortcutEntry } from './index'

export const legalShortcuts: Record<string, ShortcutEntry> = {
  mentions: {
    keys: ['l', 'm'],
    label: 'Mentions Légales',
    path: '/legal/mentions',
    isGlobal: true,
    group: 'Légal',
    modifier: 'Shift'
  },
  privacy: {
    keys: ['l', 'p'],
    label: 'Politique de Confidentialité',
    path: '/legal/privacy',
    isGlobal: true,
    group: 'Légal',
    modifier: 'Shift'
  },
  terms: {
    keys: ['l', 't'],
    label: 'Conditions d\'Utilisation',
    path: '/legal/terms',
    isGlobal: true,
    group: 'Légal',
    modifier: 'Shift'
  },
}
