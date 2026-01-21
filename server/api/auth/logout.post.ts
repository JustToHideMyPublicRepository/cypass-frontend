import { defineEventHandler, deleteCookie, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  deleteCookie(event, 'cypass_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  return { success: true, message: 'Déconnecté avec succès' }
})
