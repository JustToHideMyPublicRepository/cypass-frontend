import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const id = event.context.params?.id || getQuery(event).id as string

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentification requise'
    })
  }

  try {
    const response = await $fetch(`${baseApi}/vigitech/get_one_user/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    return response
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      message: 'Incident non trouvé ou accès refusé'
    })
  }
})
