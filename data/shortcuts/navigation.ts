import type { ShortcutEntry } from './index'

export const navigationShortcuts: Record<string, ShortcutEntry> = {
  home: {
    keys: ['/'],
    label: 'Accueil',
    path: '/',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  about: {
    keys: ['b'],
    label: 'À propos',
    path: '/about',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  coming_soon: {
    keys: ['s'],
    label: 'Bientôt disponible',
    path: '/coming-soon',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  contact: {
    keys: ['c'],
    label: 'Contact',
    path: '/contact',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  developers: {
    keys: ['x'],
    label: 'Developpeur',
    path: '/developers',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  faq: {
    keys: ['f'],
    label: 'FAQ',
    path: '/faq',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  partners: {
    keys: ['p'],
    label: 'Partenaires',
    path: '/partners',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  status: {
    keys: ['t'],
    label: 'État des services',
    path: '/status',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  support: {
    keys: ['h'],
    label: 'Support',
    path: '/support',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  },
  verify: {
    keys: ['v'],
    label: 'Vérifier un document',
    path: '/verify',
    isGlobal: true,
    group: 'Navigation',
    modifier: 'Shift'
  }
}
