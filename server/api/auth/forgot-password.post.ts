import { defineEventHandler, readBody, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  try {
    const response = await $fetch<{ success: boolean; message: string; data: any }>(`${baseApi}/api/auth/forgot_password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(body).toString()
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
