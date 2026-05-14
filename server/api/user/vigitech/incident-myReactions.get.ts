import { defineEventHandler, getCookie, createError, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  try {
    const response = await $fetch(`${baseApi}/user/vigitech/my_reactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: query
    })
    return response
  } catch (err: any) {
    return { success: false, message: err.data?.message || err.message || 'Erreur lors de la récupération de vos réactions' }
  }
})
