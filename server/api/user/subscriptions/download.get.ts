import { defineEventHandler, getCookie, createError, sendProxy, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const paymentId = query.id
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI as string

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé',
      message: 'Veuillez vous connecter pour télécharger le reçu.'
    })
  }

  if (!paymentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Requête invalide',
      message: 'L\'identifiant de la transaction est requis.'
    })
  }

  const url = `${baseApi}/user/subscriptions/${paymentId}/download`

  return sendProxy(event, url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
})
