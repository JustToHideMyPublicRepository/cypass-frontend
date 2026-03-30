import { defineEventHandler, getQuery, createError, setCookie, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const query = getQuery(event)

  try {
    const response: any = await $fetch(`${baseApi}/user/auth/mfaMtd_magic_verify`, {
      method: 'GET',
      params: {
        email: query.email,
        token: query.token
      },
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
      message: error.data?.message || 'Lien magique invalide ou expiré'
    })
  }
})
