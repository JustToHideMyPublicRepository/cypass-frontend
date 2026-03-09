import { defineEventHandler, getCookie, createError, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: 'ID de notification manquant'
    })
  }

  try {
    const response: any = await $fetch(`${baseApi}/notifications/delete.php`, {
      method: 'DELETE',
      query: { id: query.id },
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la suppression de la notification'
    })
  }
})
