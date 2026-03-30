import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
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

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Lien magique invalide ou expiré'
    })
  }
})
