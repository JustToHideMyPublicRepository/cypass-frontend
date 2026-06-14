// Base URLs
export const IMG_BASE = 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images'
export const LK_BASE = 'https://www.linkedin.com/in'
export const FB_BASE = 'https://www.facebook.com'
export const X_BASE = 'https://X.com'

// Helper function to resolve team member image URLs
export function getTeamImageUrl(filename: string): string {
  return `${IMG_BASE}/${filename}`
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
  mobileColor: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-MC.png', // version mobile couleur du logo
  mobileWhite: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-MW.png', // version mobile blanc du logo
  desktopColor: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-DC.png', // version desktop couleur
  desktopWhite: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-DW.png', // version desktop blanc
  minimalistColor: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-MinimC.png', // version minimaliste couleur
  minimalistWhite: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-MinimW.png', // version minimaliste blanc
  logo3D: 'https://cdn.jsdelivr.net/gh/JustToHideMyPublicRepository/Files/Images/logos/CYPASS-3D.png', // version 3D
} as const
