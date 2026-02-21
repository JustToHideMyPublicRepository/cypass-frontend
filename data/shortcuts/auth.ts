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
}
