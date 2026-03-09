import { defineEventHandler, readMultipartFormData, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  try {
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Aucun fichier QR fourni'
      })
    }

    const backendFormData = new FormData()
    for (const item of formData) {
      if (item.name === 'file' && item.data) {
        const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
        backendFormData.append('file', blob, item.filename)
      }
    }

    const response: any = await $fetch(`${baseApi}/documents/verify-qr-image.php`, {
      method: 'POST',
      headers: { 'accept': 'application/json' },
      body: backendFormData
    })

    return response
  } catch (error: any) {
    console.error('QR Verify Proxy Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || error.message || 'Erreur lors de la vérification du QR code sur le serveur',
      data: error.data
    })
  }
})
