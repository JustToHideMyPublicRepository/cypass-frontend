import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  const body = await readBody(event)

  try {
    const response = await $fetch(`${baseApi}/vigitech/update_comment.php`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body).toString()
    })
    return response
  } catch (err: any) {
    return { success: false, message: err.data?.message || err.message || 'Erreur lors de la mise à jour du commentaire' }
  }
})
