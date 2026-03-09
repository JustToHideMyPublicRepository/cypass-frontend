import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const query = getQuery(event)

  try {
    const headers: Record<string, string> = {
      'accept': 'application/json'
    }

    const response: any = await $fetch(`${baseApi}/documents/verify.php`, {
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
      message: error.data?.message || error.message || 'Erreur lors de la vérification du document',
      data: error.data
    })
  }
})
