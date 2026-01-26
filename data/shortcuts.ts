export interface ShortcutEntry {
  keys: string[]
  label: string
  path?: string
  isGlobal: boolean
  group?: string
  modifier?: string
}

export const shortcutsData: Record<string, ShortcutEntry> = {
  // NAVIGATION
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
  },

  // LEGAL
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

  // AUTHENTIFICATION
  login: {
    keys: ['a', 'l'],
    label: 'Connexion',
    path: '/auth/login',
    isGlobal: true,
    group: 'Authentification',
    modifier: 'Shift'
  },
  register: {
    keys: ['a', 'r'],
    label: 'Inscription',
    path: '/auth/register',
    isGlobal: true,
    group: 'Authentification',
    modifier: 'Shift'
  },
  verify_email: {
    keys: ['a', 'm'],
    label: 'Vérifier Email',
    path: '/auth/verify_email',
    isGlobal: true,
    group: 'Authentification',
    modifier: 'Shift'
  },
  reset_password: {
    keys: ['a', 'p'],
    label: 'Réinitialiser Mot de passe',
    path: '/auth/reset-password',
    isGlobal: true,
    group: 'Authentification',
    modifier: 'Shift'
  },

  // MODULES
  modules_index: {
    keys: ['m', 'i'],
    label: 'Tous les modules',
    path: '/modules',
    isGlobal: true,
    group: 'Modules',
    modifier: 'Shift'
  },
  module_docsentry: {
    keys: ['m', '1'],
    label: 'Module Docsentry',
    path: '/modules/docsentry',
    isGlobal: true,
    group: 'Modules',
    modifier: 'Shift'
  },
  module_vigitech: {
    keys: ['m', '2'],
    label: 'Module Vigitech',
    path: '/modules/vigitech',
    isGlobal: true,
    group: 'Modules',
    modifier: 'Shift'
  },

  // DASHBOARD
  dashboard_home: {
    keys: ['d', 'i'],
    label: 'Tableau de bord',
    path: '/dashboard',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  profile: {
    keys: ['d', 'p'],
    label: 'Mon Profil',
    path: '/dashboard/profile',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },
  logs: {
    keys: ['d', 'l'],
    label: 'Journal d\'activité',
    path: '/dashboard/logs',
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
  settings: {
    keys: ['d', 't'],
    label: 'Paramètres',
    path: '/dashboard/settings',
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
  vigitech: {
    keys: ['d', 'v'],
    label: 'Vigitech',
    path: '/dashboard/vigitech',
    isGlobal: true,
    group: 'Dashboard',
    modifier: 'Shift'
  },

  // SPECIFIC
  search: {
    keys: ['k'],
    label: 'Rechercher',
    isGlobal: false,
    modifier: 'Ctrl'
  },
  help: {
    keys: ['?'],
    label: 'Aide (Raccourcis clavier)',
    path: '/help/shortcuts',
    isGlobal: false
  },

  // ACTIONS
  toggle_help: {
    keys: ['espace'],
    label: 'Ouvrir le centre d\'aide',
    isGlobal: false,
    group: 'Actions'
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
  logout: {
    keys: ['d'],
    label: 'Déconnexion',
    isGlobal: true,
    group: 'Actions',
    modifier: 'Ctrl + Shift'
  },

  // BOUTONS
  modal_close: {
    keys: ['esc'],
    label: 'Fermer la modale',
    isGlobal: false,
    group: 'Modal & Boutons'
  },
  modal_confirm: {
    keys: ['y'],
    label: 'Confirmer (Oui)',
    isGlobal: false,
    group: 'Modal & Boutons'
  },
  modal_cancel: {
    keys: ['n'],
    label: 'Annuler (Non)',
    isGlobal: false,
    group: 'Modal & Boutons'
  },
  modal_next: {
    keys: ['enter'],
    label: 'Étape suivante / Valider',
    isGlobal: false,
    group: 'Modal & Boutons'
  }
}

export const getShortcutStr = (name: string): string => {
  const s = shortcutsData[name]
  if (!s) return ''
  const keys = s.keys.map(k => k.toUpperCase()).join(' + ')
  if (s.modifier) return `${s.modifier} + ${keys}`
  return keys
}

export const getLinkTooltip = (pathOrName: string) => {
  const entry = shortcutsData[pathOrName] || Object.values(shortcutsData).find(s => s.path === pathOrName)
  if (!entry) return null

  const modifiers = entry.modifier
    ? entry.modifier.split('+').map(m => `<span class="kbd-hint">${m.trim()}</span>`).join(' + ') + ' + '
    : ''

  const keys = entry.keys.map(k => `<span class="kbd-hint">${k === 'enter' ? '↵' : k.toUpperCase()}</span>`).join(' + ')

  return `<span class="kbd-wrapper">${modifiers}${keys}</span>`
}

export const getShortcutKey = (path: string): string | null => {
  const entry = Object.values(shortcutsData).find(s => s.path === path)
  return entry ? entry.keys[entry.keys.length - 1].toUpperCase() : null
}
