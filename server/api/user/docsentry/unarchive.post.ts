import { defineEventHandler, readMultipartFormData, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  try {
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'ID de document manquant'
      })
    }

    const backendFormData = new FormData()
    for (const item of formData) {
      if (item.name === 'document_id' && item.data) {
        backendFormData.append('document_id', item.data.toString())
      }
    }

    const response: any = await $fetch(`${baseApi}/user/docsentry/unarchive`, {
      method: 'POST' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: backendFormData
    })

    return response
  } catch (error: any) {
    console.error('Document Unarchive Proxy Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors du désarchivage du document'
    })
  }
})
