import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  try {
    const response = await $fetch(`${baseApi}/vigitech/get_user_comments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response
  } catch (err: any) {
    return { success: false, message: err.data?.message || err.message || 'Erreur lors de la récupération des commentaires' }
  }
})
