import { defineEventHandler, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.public?.cypassBaseAPI || config.cypassBaseAPI
  const query = getQuery(event)

  try {
    const response: any = await $fetch(`${baseApi}/public/system/history`, {
      method: 'GET' as 'GET',
      headers: {
        'Accept': 'application/json'
      },
      params: query
    })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la récupération de l\'historique',
      data: { incidents: [] }
    }
  }
})
