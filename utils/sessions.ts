import { IconDeviceDesktop, IconDeviceMobile, IconTerminal, IconHelp } from '@tabler/icons-vue'

export interface SessionInfo {
  user_agent?: string
  browser?: string
  os?: string
}

/**
 * Formats a consistent label for a session or activity based on UA, browser, and OS.
 */
export const formatSessionLabel = (session: SessionInfo): string => {
  if (session.user_agent === 'node') return 'Script Node.js'

  if (session.browser && session.browser !== 'Inconnu' && session.os && session.os !== 'Inconnu') {
    return `${session.browser} sur ${session.os}`
  }
  if (session.os && session.os !== 'Inconnu') return session.os
  if (session.browser && session.browser !== 'Inconnu') return session.browser

  const ua = session.user_agent || ''
  if (ua.includes('Windows')) return 'Windows PC'
  if (ua.includes('Mac')) return 'Mac'
  if (ua.includes('Linux')) return 'Linux Desktop'
  if (ua.includes('iPhone')) return 'iPhone'
  if (ua.includes('Android')) return 'Android Device'
  return 'Appareil Inconnu'
}

/**
 * Returns the appropriate icon component for a session or activity.
 */
export const getSessionIcon = (session: SessionInfo) => {
  if (session.user_agent === 'node') return IconTerminal
  const ua = (session.user_agent || '').toLowerCase()
  if (ua.includes('iphone') || ua.includes('android')) return IconDeviceMobile
  if (ua.includes('windows') || ua.includes('mac') || ua.includes('linux')) return IconDeviceDesktop
  return IconHelp
}
