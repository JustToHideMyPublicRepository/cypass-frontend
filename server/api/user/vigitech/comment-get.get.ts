import { defineEventHandler, getQuery, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const query = getQuery(event)
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    return { success: false, message: 'Non authentifié' }
  }

  try {
    const response = await $fetch(`${baseApi}/vigitech/get_comment_details`, {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${token}`
      },
      query
    })
    return response
  } catch (err: any) {
    return { success: false, data: null, message: err.message }
  }
})
