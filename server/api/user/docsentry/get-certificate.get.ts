import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

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
      message: error.data?.message || error.message || 'Erreur lors du téléchargement'
    })
  }
})
