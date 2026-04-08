import { defineEventHandler, getCookie, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const body = await readBody(event)
  const id = body.report_id

  try {
    const response: any = await $fetch(`${baseApi}/user/report_incident/delete/${id}`, {
      method: 'DELETE',
      body,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la suppression du signalement'
    }
  }
})
