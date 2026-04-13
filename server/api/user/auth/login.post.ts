import { defineEventHandler, readBody, setCookie, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  try {
    const response = await $fetch.raw<{ success: boolean; message: string; data: any }>(`${baseApi}/user/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(body).toString()
    })

    const data = response._data

    if (data?.success && data?.data.token) {
      // Forward cookies from backend (like cypass_auth_hints)
      const setCookies = response.headers.getSetCookie()
      setCookies.forEach(cookie => {
        appendHeader(event, 'set-cookie', cookie)
      })

      // Set the token as a secure HttpOnly cookie (override if provided by backend, or just set it)
      setCookie(event, 'cypass_token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      // Return the response without the token to the client
      const { token, ...userData } = data.data
      return {
        ...data,
        data: userData
      }
    }

    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
