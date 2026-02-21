import type { ShortcutEntry } from './index'

export const modalBtnShortcuts: Record<string, ShortcutEntry> = {
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
