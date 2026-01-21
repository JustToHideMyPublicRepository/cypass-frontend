import { defineEventHandler, getCookie, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const response = await $fetch<{ success: boolean; message: string; data: any }>(`${baseApi}/api/auth/verify_token.php`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
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
