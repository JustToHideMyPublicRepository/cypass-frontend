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
        message: 'Aucun document fourni'
      })
    }

    const backendFormData = new FormData()
    for (const item of formData) {
      if (item.name === 'document' && item.data) {
        const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
        backendFormData.append('document', blob, item.filename)
      }
    }

    const response: any = await $fetch(`${baseApi}/documents/upload.php`, {
      method: 'POST' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: backendFormData
    })

    return response
  } catch (error: any) {
    console.error('Document Upload Proxy Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de l’authentification du document sur le serveur'
    })
  }
})
