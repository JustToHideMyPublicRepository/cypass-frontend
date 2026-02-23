/**
 * Centralized utility to resolve user avatar URLs.
 * Handles Dicebear initials fallback and storage path prefixing.
 */
export const getUserAvatarUrl = (
  avatarUrl: string | null | undefined,
  firstName?: string | null,
  lastName?: string | null
): string => {
  // 1. Resolve to /uploads/ if it's an uploaded avatar
  if (avatarUrl && avatarUrl.trim() !== '') {
    if (avatarUrl.startsWith('http')) {
      return avatarUrl
    }

    // Clean and prefix with /uploads/
    const cleanPath = avatarUrl.replace(/^\/+/, '').replace(/^uploads\//i, '').replace(/^\/+/, '')
    return `/uploads/${cleanPath}`
  }

  // 2. Fallback to Dicebear initials
  const seed = `${firstName || ''} ${lastName || ''}`.trim() || 'Utilisateur'
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`
}
