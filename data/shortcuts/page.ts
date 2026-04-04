import type { ShortcutEntry } from './index'

export const pageShortcuts: Record<string, ShortcutEntry> = {
  about: {
    keys: ['b'],
    label: 'À propos',
    path: '/about',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  home: {
    keys: ['/'],
    label: 'Accueil',
    path: '/',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  coming_soon: {
    keys: ['s'],
    label: 'Bientôt disponible',
    path: '/coming-soon',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  contact: {
    keys: ['c'],
    label: 'Contact',
    path: '/contact',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  developers: {
    keys: ['x'],
    label: 'Developpeur',
    path: '/developers',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  status: {
    keys: ['t'],
    label: 'État des services',
    path: '/system/status',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  faq: {
    keys: ['f'],
    label: 'FAQ',
    path: '/faq',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  partners: {
    keys: ['p'],
    label: 'Partenaires',
    path: '/partners',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  support: {
    keys: ['h'],
    label: 'Support',
    path: '/support',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  pricing: {
    keys: ['r'],
    label: 'Tarification',
    path: '/pricings',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  verify: {
    keys: ['v'],
    label: 'Vérifier un document',
    path: '/verify',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  },
  incidents: {
    keys: ['g'],
    label: 'Voir incidents',
    path: '/vigitech',
    isGlobal: true,
    group: 'Page',
    modifier: 'Shift'
  }
}
