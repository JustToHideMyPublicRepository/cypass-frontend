import { defineEventHandler, readMultipartFormData, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentification requise'
    })
  }

  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({ statusCode: 400, message: 'Données invalides' })
    }

    const externalFormData = new FormData()

    for (const item of formData) {
      if (item.name === 'evidence' && item.filename) {
        const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
        externalFormData.append('evidence', blob, item.filename)
      } else if (item.name) {
        externalFormData.append(item.name, item.data.toString())
      }
    }

    const response = await $fetch(`${baseApi}/vigitech/create_incident`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: externalFormData
    })

    return response
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Erreur lors du signalement'
    })
  }
})
