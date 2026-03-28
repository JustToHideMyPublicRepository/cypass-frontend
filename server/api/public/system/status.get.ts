import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.public?.cypassBaseAPI || config.cypassBaseAPI

  try {
    const response: any = await $fetch(`${baseApi}/public/system/status`, {
      method: 'GET' as 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la récupération du statut',
      data: { components: [] }
    }
  }
})
