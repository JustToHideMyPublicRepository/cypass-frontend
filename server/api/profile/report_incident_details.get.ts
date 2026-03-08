import { defineEventHandler, getCookie, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const { id } = getQuery(event)

  try {
    const response: any = await $fetch(`${baseApi}/vigitech/get_report.php`, {
      params: { id },
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la récupération des détails du signalement d\'incident'
    }
  }
})
