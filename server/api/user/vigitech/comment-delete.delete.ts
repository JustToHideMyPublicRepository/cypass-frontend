import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  const query = getQuery(event)
  const commentId = query.comment_id

  // Build form data as required by the backend
  const params = new URLSearchParams()
  if (commentId) params.append('comment_id', String(commentId))

  try {
    const res = await fetch(`${baseApi}/vigitech/delete_comment`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
    const data = await res.json()
    return data
  } catch (err: any) {
    return { success: false, message: err.message || 'Erreur lors de la suppression' }
  }
})
