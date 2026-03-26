import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentification requise'
    })
  }

  try {
    const response = await $fetch(`${baseApi}/vigitech/get_all_user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query
    })
    return response
  } catch (err: any) {
    return { success: false, data: [], message: err.message }
  }
})
