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
      responseType: 'blob',
      query: getQuery(event)
    })

    return response
  } catch (error: any) {
    console.error('Download ZIP Proxy Error:', error)
    let errorMessage = 'Erreur lors du téléchargement de l’archive ZIP'
    
    try {
      if (error.data) {
        if (Buffer.isBuffer(error.data)) {
          const json = JSON.parse(error.data.toString())
          if (json.message) errorMessage = json.message
        } else if (typeof error.data.text === 'function') {
          const text = await error.data.text()
          const json = JSON.parse(text)
          if (json.message) errorMessage = json.message
        } else if (error.data.message) {
          errorMessage = error.data.message
        }
      } else if (error.response?._data) {
        if (Buffer.isBuffer(error.response._data)) {
          const json = JSON.parse(error.response._data.toString())
          if (json.message) errorMessage = json.message
        }
      }
    } catch (e) {
      // safe fallback
    }

    throw createError({
      statusCode: error.response?.status || 500,
      message: errorMessage
    })
  }
})
