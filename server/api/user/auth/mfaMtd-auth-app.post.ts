import { defineEventHandler, readBody, createError, setCookie, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)

  try {
    const formData = new FormData()
    formData.append('email', body.email)
    formData.append('code', body.code)

    const response: any = await $fetch(`${baseApi}/user/auth/mfaMtd_auth_app`, {
      method: 'POST',
      body: formData,
      headers: {
        'accept': 'application/json'
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

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Code Authenticator invalide ou expiré'
    })
  }
})
