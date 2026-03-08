import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  try {
    const response: any = await $fetch(`${baseApi}/vigitech/received_reports.php`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la récupération des signalements d\'incidents reçus'
    }
  }
})
