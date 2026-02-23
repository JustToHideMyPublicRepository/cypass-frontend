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
        message: 'Aucun document ou certificat fourni'
      })
    }

    const backendFormData = new FormData()
    backendFormData.append('original_file', '')
    backendFormData.append('certificate_file', '')

    for (const item of formData) {
      if (item.data && (item.name === 'original_file' || item.name === 'certificate_file')) {
        const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
        backendFormData.set(item.name, blob, item.filename)
      }
    }

    const response: any = await $fetch(`${baseApi}/documents/verify.php`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: backendFormData
    })

    return response
  } catch (error: any) {
    console.error('Document Verify Proxy Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || error.message || 'Erreur lors de la vérification du document',
      data: error.data
    })
  }
})
