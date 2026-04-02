import { defineEventHandler, getCookie, createError } from 'h3'
import type { Subscription, SubscriptionResponse } from '~/types/subscription'

export default defineEventHandler(async (event): Promise<SubscriptionResponse<Subscription[]>> => {
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI as string

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé',
      message: 'Veuillez vous connecter pour accéder à vos transactions.'
    })
  }

  try {
    const response = await $fetch<SubscriptionResponse<Subscription[]>>(`${baseApi}/user/subscriptions/latest`, {
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
      message: err.data?.message || 'Impossible de récupérer la liste des transactions.',
      data: err.data
    })
  }
})
