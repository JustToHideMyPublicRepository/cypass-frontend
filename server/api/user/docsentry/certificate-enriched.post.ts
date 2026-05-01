import { defineEventHandler, getCookie, createError, readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  try {
    const body = await readMultipartFormData(event)
    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'No form data found'
      })
    }

    // Convert multipart form data back into a format suitable for the final backend
    const formData = new FormData()
    body.forEach(part => {
      if (part.name) {
        if (part.filename) {
          const blob = new Blob([new Uint8Array(part.data)], { type: part.type })
          formData.append(part.name, blob, part.filename)
        } else {
          formData.append(part.name, part.data.toString())
        }
      }
    })

    const response: any = await $fetch(`${baseApi}/user/docsentry/certificate_enriched`, {
      method: 'POST' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: formData
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la certification enrichie'
    })
  }
})
