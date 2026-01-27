import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: 'ID du document manquant'
    })
  }

  try {
    const response: any = await $fetch(`${baseApi}/documents/get.php`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      query: {
        id: query.id
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la récupération des détails du document'
    })
  }
})
