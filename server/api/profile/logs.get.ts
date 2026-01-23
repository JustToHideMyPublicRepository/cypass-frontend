import { defineEventHandler, getQuery, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const token = getCookie(event, 'auth_token')

  try {
    const response: any = await $fetch(`${config.public.cypassBaseAPI}/profile/get_user_logs.php`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      query: {
        limit: query.limit || 50,
        type: query.type || 'all',
        date: query.date || undefined
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
