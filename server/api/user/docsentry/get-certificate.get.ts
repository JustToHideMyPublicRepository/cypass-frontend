import { defineEventHandler, getQuery, getCookie, createError, appendHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  try {
    const response = await $fetch.raw(`${baseApi}/user/docsentry/get_certificate/${query.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: getQuery(event)
    })

    const contentType = response.headers.get('content-type')
    const contentDisposition = response.headers.get('content-disposition')

    if (contentType) appendHeader(event, 'Content-Type', contentType)
    if (contentDisposition) appendHeader(event, 'Content-Disposition', contentDisposition)

    return response._data
  } catch (error: any) {
    console.error('Download Certificate Proxy Error:', error)
    let errorMessage = 'Erreur lors du téléchargement'
    
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
