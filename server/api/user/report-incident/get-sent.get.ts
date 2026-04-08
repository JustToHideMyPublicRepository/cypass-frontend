import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID du signalement requis' })
  }

  try {
    const res = await fetch(`${baseApi}/user/report_incident/get_sent/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    const data = await res.json()
    return data
  } catch (err: any) {
    return { success: false, message: 'Erreur lors de la récupération du signalement envoyé' }
  }
})
