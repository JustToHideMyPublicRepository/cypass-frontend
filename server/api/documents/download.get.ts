import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: 'ID du document manquant'
    })
  }

  try {
    const response = await $fetch.raw(`${baseApi}/documents/download.php`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: {
        id: query.id,
        type: query.type || 'certificate'
      }
    })

    const contentType = response.headers.get('content-type')
    const contentDisposition = response.headers.get('content-disposition')

    if (contentType) appendHeader(event, 'Content-Type', contentType)
    if (contentDisposition) appendHeader(event, 'Content-Disposition', contentDisposition)

    return response._data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors du téléchargement'
    })
  }
})
