import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const { id } = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID du document manquant'
    })
  }

  try {
    const response: any = await $fetch(`${baseApi}/user/docsentry/download-zip/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/zip'
      },
      responseType: 'blob'
    })

    return response
  } catch (error: any) {
    console.error('Download ZIP Proxy Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors du téléchargement de l’archive ZIP'
    })
  }
})
