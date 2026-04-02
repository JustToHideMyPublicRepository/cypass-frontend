import { defineEventHandler, getCookie, createError, getQuery } from 'h3'
import type { Subscription, SubscriptionResponse } from '~/types/subscription'

export default defineEventHandler(async (event): Promise<SubscriptionResponse<Subscription>> => {
  const query = getQuery(event)
  const paymentId = query.id as string
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI as string

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé',
      message: 'Veuillez vous connecter pour accéder aux détails.'
    })
  }

  if (!paymentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Requête invalide',
      message: 'L\'identifiant de la transaction est requis.'
    })
  }

  try {
    const response = await $fetch<SubscriptionResponse<Subscription>>(`${baseApi}/user/subscriptions/${paymentId}`, {
      method: 'GET',
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
      message: err.data?.message || 'Impossible de récupérer les détails de la transaction.',
      data: err.data
    })
  }
})
