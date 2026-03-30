import { defineEventHandler, readBody, createError, type H3Event } from 'h3'

interface MfaResponse {
  success: boolean
  data?: {
    user: any
    token: string
    created_at: string
    expires_at: string
  }
  message: string
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  if (!body.email || !body.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and code are required'
    })
  }

  try {
    const response = await $fetch<MfaResponse>(`${baseApi}/user/auth/mfaMtd_topt_verify`, {
      method: 'POST',
      body: new URLSearchParams(body).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    })

    if (response.success && response.data?.token) {
      // Set the auth token cookie
      setCookie(event, 'cypass_token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      // Strip token for client response
      const { token, ...safeData } = response.data
      return {
        ...response,
        data: safeData
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
