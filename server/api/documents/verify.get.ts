import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  try {
    const headers: Record<string, string> = {
      'accept': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response: any = await $fetch(`${config.public.cypassBaseAPI}/api/documents/verify.php`, {
      method: 'GET',
      headers,
      query: {
        h: query.h
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la vérification du document'
    })
  }
})
