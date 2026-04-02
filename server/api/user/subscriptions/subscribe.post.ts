import { defineEventHandler, getCookie, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé',
      message: 'Veuillez vous connecter pour souscrire à un pack.'
    })
  }

  try {
    const response = await $fetch<any>(`${baseApi}/user/subscriptions/subscribe`, {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Erreur Serveur',
      message: err.data?.message || 'Une erreur est survenue lors de la souscription.',
      data: err.data
    })
  }
})
