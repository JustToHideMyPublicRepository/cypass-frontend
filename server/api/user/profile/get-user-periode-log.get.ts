import { defineEventHandler, getCookie, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.public?.cypassBaseAPI || config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  try {
    const response: any = await $fetch(`${baseApi}/profile/logs/period`, {
      method: 'GET' as 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      params: query
    })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || 'Erreur interne du serveur lors de la récupération des logs.'
    }
  }
})
