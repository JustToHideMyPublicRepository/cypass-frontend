import type { ShortcutEntry } from './index'

export const legalShortcuts: Record<string, ShortcutEntry> = {
  terms: {
    keys: ['l', 't'],
    label: 'Conditions d\'utilisation',
    path: '/legal/terms',
    isGlobal: true,
    group: 'Légal',
    modifier: 'Shift'
  },
  mentions: {
    keys: ['l', 'm'],
    label: 'Mentions légales',
    path: '/legal/mentions',
    isGlobal: true,
    group: 'Légal',
    modifier: 'Shift'
  },
  privacy: {
    keys: ['l', 'p'],
    label: 'Politique de confidentialité',
    path: '/legal/privacy',
    isGlobal: true,
    group: 'Légal',
    modifier: 'Shift'
  },
}
