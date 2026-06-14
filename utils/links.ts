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
  mobileColor: `${IMG_BASE}/logos/CYPASS-MC.png`,
  mobileWhite: `${IMG_BASE}/logos/CYPASS-MW.png`,
  desktopColor: `${IMG_BASE}/logos/CYPASS-DC.png`,
  desktopWhite: `${IMG_BASE}/logos/CYPASS-DW.png`,
  minimalistColor: `${IMG_BASE}/logos/CYPASS-MinimC.png`,
  minimalistWhite: `${IMG_BASE}/logos/CYPASS-MinimW.png`,
  logo3D: `${IMG_BASE}/logos/CYPASS-3D.png`,
} as const
