import type { ShortcutEntry } from './index'

export const moduleShortcuts: Record<string, ShortcutEntry> = {
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
}
