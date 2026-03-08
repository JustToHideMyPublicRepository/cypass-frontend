import { defineEventHandler, readBody, getCookie, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const token = getCookie(event, 'cypass_token')
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const response = await $fetch<{ success: boolean; message: string; data: any }>(`${baseApi}/profile/sessions.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
