import { defineEventHandler, readMultipartFormData, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Aucun fichier fourni'
    })
  }

  // Create a new FormData to send to the backend
  const backendFormData = new FormData()

  for (const item of formData) {
    if (item.name === 'avatar' && item.data) {
      const blob = new Blob([new Uint8Array(item.data)], { type: item.type })
      backendFormData.append('avatar', blob, item.filename)
    }
  }

  try {
    const response: any = await $fetch(`${config.public.cypassBaseAPI}/profile/upload_avatar.php`, {
      method: 'POST',
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
      message: error.data?.message || 'Erreur lors de l\'upload de l\'avatar'
    })
  }
})
