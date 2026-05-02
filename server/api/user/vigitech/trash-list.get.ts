import { defineEventHandler, getQuery, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    return { success: false, message: 'Non autorisé' }
  }

  const queryParams = getQuery(event)
  const limit = queryParams.limit || 50
  const offset = queryParams.offset || 0

  try {
    const response = await $fetch(`${baseApi}/user/vigitech/trash_list`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: { limit, offset }
    })
    return response
  } catch (error: any) {
    console.error('Error fetching trash list:', error)
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la récupération de la corbeille'
    }
  }
})
