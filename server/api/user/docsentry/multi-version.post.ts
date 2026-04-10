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
        message: 'Aucune donnée fournie'
      })
    }

    const backendFormData = new FormData()
    
    for (const item of formData) {
      if (item.name === 'recipients_csv' && item.data) {
        const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
        backendFormData.append('recipients_csv', blob, item.filename)
      } else if (item.data) {
        // Handle other fields (document_id, recipients_manual)
        backendFormData.append(item.name!, item.data.toString())
      }
    }

    const response: any = await $fetch(`${baseApi}/user/docsentry/multi-version`, {
      method: 'POST' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: backendFormData
    })

    return response
  } catch (error: any) {
    console.error('Multi-version Generation Proxy Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors du lancement du traitement multi-version'
    })
  }
})
