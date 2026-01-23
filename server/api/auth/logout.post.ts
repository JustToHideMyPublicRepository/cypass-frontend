import { defineEventHandler, getCookie, deleteCookie, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  if (token) {
    try {
      await $fetch(`${baseApi}/api/profile/logout.php`, {
        method: 'POST' as any,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Backend logout failed:', error)
    }
  }

  deleteCookie(event, 'cypass_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  return { success: true, message: 'Déconnecté avec succès' }
})
