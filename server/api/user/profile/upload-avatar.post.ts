import { defineEventHandler, readMultipartFormData, readBody, getCookie, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const contentType = getHeader(event, 'content-type') || ''

  try {
    // Handle deletion request (JSON)
    if (contentType.includes('application/json')) {
      const body = await readBody(event)
      if (body.action === 'delete') {
        const backendFormData = new FormData()
        backendFormData.append('action', 'delete')

        const response: any = await $fetch(`${baseApi}/profile/upload_avatar.php`, {
          method: 'POST' as any,
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          },
          body: backendFormData
        })
        return response
      }
    }

    // Handle file upload (Multipart)
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Aucun fichier fourni'
      })
    }

    const backendFormData = new FormData()
    for (const item of formData) {
      if (item.name === 'avatar' && item.data) {
        const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
        backendFormData.append('avatar', blob, item.filename)
      }
    }

    const response: any = await $fetch(`${baseApi}/profile/upload_avatar.php`, {
      method: 'POST' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: backendFormData
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la gestion de l\'avatar'
    })
  }
})
