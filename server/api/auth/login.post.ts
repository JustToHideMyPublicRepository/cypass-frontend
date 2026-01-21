import { defineEventHandler, readBody, setCookie, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  try {
    const response = await $fetch<{ success: boolean; message: string; data: any }>(`${baseApi}/api/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(body).toString()
    })

    if (response.success && response.data.token) {
      // Set the token as a secure HttpOnly cookie
      setCookie(event, 'cypass_token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      // Return the response without the token to the client
      const { token, ...userData } = response.data
      return {
        ...response,
        data: userData
      }
    }

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
