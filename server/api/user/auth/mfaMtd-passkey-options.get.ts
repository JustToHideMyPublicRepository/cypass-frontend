import { defineEventHandler, getQuery, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const query = getQuery(event)

  try {
    const response: any = await $fetch(`${baseApi}/user/auth/mfaMtd_passkey_options`, {
      method: 'GET',
      params: {
        email: query.email
      },
      headers: {
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Impossible d\'obtenir les options WebAuthn.'
    })
  }
})
