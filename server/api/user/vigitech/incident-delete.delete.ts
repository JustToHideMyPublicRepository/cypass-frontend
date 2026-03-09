import { defineEventHandler, getQuery, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentification requise' })
  }

  const query = getQuery(event)
  const incidentId = query.incident_id

  // Build form data as required by the backend
  const params = new URLSearchParams()
  if (incidentId) params.append('incident_id', String(incidentId))

  try {
    const res = await fetch(`${baseApi}/vigitech/delete_incident.php`, {
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
