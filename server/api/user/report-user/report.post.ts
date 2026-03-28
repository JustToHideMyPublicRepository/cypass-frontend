import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  const body = await readBody(event)

  // Build form data exactly like the cURL example
  const params = new URLSearchParams()
  if (body.reported_user_id) params.append('reported_user_id', String(body.reported_user_id))
  if (body.reason) params.append('reason', String(body.reason))
  if (body.details) params.append('details', String(body.details))

  try {
    // Use native fetch to avoid ofetch rewriting Content-Type or body
    const res = await fetch(`${baseApi}/user/report_user/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
    const data = await res.json()
    return data
  } catch (err: any) {
    return { success: false, message: err.data?.message || err.message || 'Erreur lors du signalement' }
  }
})
