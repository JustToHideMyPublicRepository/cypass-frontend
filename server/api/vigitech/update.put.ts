import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  const body = await readBody(event)

  // Flatten any non-string values for URLSearchParams compatibility
  const flatBody: Record<string, string> = {}
  for (const key in body) {
    const val = body[key]
    if (val === null || val === undefined || val === '') continue
    flatBody[key] = String(val)
  }

  try {
    const response = await $fetch(`${baseApi}/vigitech/update_incident.php`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(flatBody).toString()
    })
    return response
  } catch (err: any) {
    const message = err.data?.message || err.message || 'Erreur lors de la mise à jour'
    throw createError({ statusCode: err.statusCode || 500, message })
  }
})
