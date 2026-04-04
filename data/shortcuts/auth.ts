import type { ShortcutEntry } from './index'

export const authShortcuts: Record<string, ShortcutEntry> = {
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
}
