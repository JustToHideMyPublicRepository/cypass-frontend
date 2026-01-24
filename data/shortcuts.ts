export interface ShortcutEntry {
  key: string
  label: string
  path?: string
  isGlobal: boolean
  modifier?: 'Shift' | 'Ctrl' | 'Cmd'
}

export const shortcutsData: Record<string, ShortcutEntry> = {
  // GLOBAL
  home: {
    key: 'h',
    label: 'Accueil',
    path: '/',
    isGlobal: true,
    modifier: 'Shift'
  },
  login: {
    key: 'l',
    label: 'Connexion',
    path: '/auth/login',
    isGlobal: true,
    modifier: 'Shift'
  },
  profile: {
    key: 'p',
    label: 'Profil',
    path: '/dashboard/profile',
    isGlobal: true,
    modifier: 'Shift'
  },
  mentions: {
    key: 'm',
    label: 'Mentions Légales',
    path: '/legal/mentions',
    isGlobal: true,
    modifier: 'Shift'
  },
  support: {
    key: 's',
    label: 'Support',
    path: '/support',
    isGlobal: true,
    modifier: 'Shift'
  },
  about: {
    key: 'a',
    label: 'À propos',
    path: '/about',
    isGlobal: true,
    modifier: 'Shift'
  },
  contact: {
    key: 'c',
    label: 'Contact',
    path: '/contact',
    isGlobal: true,
    modifier: 'Shift'
  },
  faq: {
    key: 'f',
    label: 'FAQ',
    path: '/faq',
    isGlobal: true,
    modifier: 'Shift'
  },
  developers: {
    key: 'd',
    label: 'Développeurs',
    path: '/developers',
    isGlobal: true,
    modifier: 'Shift'
  },
  status: {
    key: 't',
    label: 'Status',
    path: '/status',
    isGlobal: true,
    modifier: 'Shift'
  },
  services: {
    key: 'v',
    label: 'Services',
    path: '/services',
    isGlobal: true,
    modifier: 'Shift'
  },

  // SPECIFIQUE
  search: {
    key: 'k',
    label: 'Rechercher',
    isGlobal: false,
    modifier: 'Ctrl'
  },
  help: {
    key: '?',
    label: 'Aide',
    path: '/help/shortcuts',
    isGlobal: false
  }
}

export const getShortcutStr = (name: string): string => {
  const s = shortcutsData[name]
  if (!s) return ''
  if (s.modifier) return `${s.modifier} + ${s.key.toUpperCase()}`
  return s.key
}

export const getLinkTooltip = (path: string) => {
  const entry = Object.values(shortcutsData).find(s => s.path === path)
  if (!entry) return null
  const mod = entry.modifier ? `<span class="kbd-hint">${entry.modifier}</span> + ` : ''
  return `<span class="kbd-wrapper">${mod}<span class="kbd-hint">${entry.key.toUpperCase()}</span></span>`
}

export const getShortcutKey = (path: string): string | null => {
  const entry = Object.values(shortcutsData).find(s => s.path === path)
  return entry ? entry.key.toUpperCase() : null
}
