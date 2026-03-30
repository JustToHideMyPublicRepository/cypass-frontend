import { defineEventHandler, readBody, createError, setCookie, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)

  try {
    const response: any = await $fetch(`${baseApi}/user/auth/mfaMtd_passkey_verify`, {
      method: 'POST',
      body,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (response.success && response.data?.token) {
      setCookie(event, 'cypass_token', response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      const { token, ...safeData } = response.data
      return {
        ...response,
        data: safeData
      }
    }

    // In case token is directly at root (depending on trait behavior)
    if (response.token) {
      setCookie(event, 'cypass_token', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
      })
      const { token, ...safeResponse } = response
      return safeResponse
    }

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'La vérification de la Passkey a échoué.'
    })
  }
})
