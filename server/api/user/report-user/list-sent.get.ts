import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  try {
    const res = await fetch(`${baseApi}/profile/list_sent_reports`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    const data = await res.json()
    return data
  } catch (err: any) {
    return { success: false, message: 'Erreur lors de la récupération des signalements envoyés' }
  }
})
