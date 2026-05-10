import { defineEventHandler, createError, getCookie, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID du workspace manquant'
    })
  }

  try {
    const response = await $fetch(`${baseApi}/user/workspace/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.data?.message || 'Erreur lors de la suppression du workspace'
    })
  }
})
