// Base URLs
export const IMG_BASE = 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images'
export const LOGO_BASE = `${IMG_BASE}/Logos`
export const LK_BASE = 'https://www.linkedin.com/in'
export const FB_BASE = 'https://www.facebook.com'
export const X_BASE = 'https://X.com'

// Helper function to resolve team member image URLs
export function getTeamImageUrl(filename: string): string {
  return `${IMG_BASE}/Team/${filename}`
}

// Helper functions for social links
export function getLinkedinUrl(username: string): string {
  return `${LK_BASE}/${username}`
}

export function getFacebookUrl(username: string): string {
  return `${FB_BASE}/${username}`
}

export function getXUrl(username: string): string {
  return `${X_BASE}/${username}`
}

// External Logos links
export const LOGOS = {
  mobileColor: `${LOGO_BASE}/CYPASS-MC.png`,
  mobileWhite: `${LOGO_BASE}/CYPASS-MW.png`,
  desktopColor: `${LOGO_BASE}/CYPASS-DC.png`,
  desktopWhite: `${LOGO_BASE}/CYPASS-DW.png`,
  minimalistColor: `${LOGO_BASE}/CYPASS-MinimC.png`,
  minimalistWhite: `${LOGO_BASE}/CYPASS-MinimW.png`,
  logo3D: `${LOGO_BASE}/CYPASS-3D.png`,
} as const
