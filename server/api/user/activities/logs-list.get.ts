import { defineEventHandler, getQuery, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const query = getQuery(event)
  const token = getCookie(event, 'cypass_token')

  try {
    const response: any = await $fetch(`${baseApi}/user/activities/logs_list`, {
      method: 'GET' as 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      query: {
        limit: 50,
        type: 'all',
        ...query
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la récupération des logs'
    })
  }
})
