import { defineEventHandler, getQuery, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  try {
    const response = await $fetch<{ success: boolean; message: string; data: any }>(`${baseApi}/api/auth/verify_email.php`, {
      method: 'GET',
      params: { token: query.token },
      headers: {
        'Accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
