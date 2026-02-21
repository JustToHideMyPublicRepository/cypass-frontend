import { actionShortcuts } from './actions'
import { authShortcuts } from './auth'
import { dashboardShortcuts } from './dashboard'
import { generalShortcuts } from './general'
import { legalShortcuts } from './legal'
import { modalBtnShortcuts } from './modal-btn'
import { moduleShortcuts } from './module'
import { navigationShortcuts } from './navigation'

export interface ShortcutEntry {
  keys: string[]
  label: string
  path?: string
  isGlobal: boolean
  group?: string
  modifier?: string
}

/**
 * Agrégation de tous les raccourcis système
 */
export const shortcutsData: Record<string, ShortcutEntry> = {
  ...actionShortcuts,
  ...authShortcuts,
  ...dashboardShortcuts,
  ...generalShortcuts,
  ...legalShortcuts,
  ...modalBtnShortcuts,
  ...moduleShortcuts,
  ...navigationShortcuts,
}

/**
 * Utilitaires pour formater les raccourcis
 */
export const getShortcutStr = (name: string, customShortcuts?: Record<string, ShortcutEntry>): string => {
  const data = customShortcuts || shortcutsData
  const s = data[name]
  if (!s) return ''
  const keys = s.keys.map(k => k.toUpperCase()).join(' + ')
  if (s.modifier) return `${s.modifier} + ${keys}`
  return keys
}

export const getLinkTooltip = (pathOrName: string, customShortcuts?: Record<string, ShortcutEntry>) => {
  const data = customShortcuts || shortcutsData
  const entry = data[pathOrName] || Object.values(data).find(s => s.path === pathOrName)
  if (!entry) return null

  const modifiers = entry.modifier
    ? entry.modifier.split('+').map(m => `<span class="kbd-hint">${m.trim()}</span>`).join(' + ') + ' + '
    : ''

  const keys = entry.keys.map(k => `<span class="kbd-hint">${k === 'enter' ? '↵' : k.toUpperCase()}</span>`).join(' + ')

  return `<span class="kbd-wrapper">${modifiers}${keys}</span>`
}

export const getShortcutKey = (path: string, customShortcuts?: Record<string, ShortcutEntry>): string | null => {
  const data = customShortcuts || shortcutsData
  const entry = Object.values(data).find(s => s.path === path)
  return entry ? entry.keys[entry.keys.length - 1].toUpperCase() : null
}
