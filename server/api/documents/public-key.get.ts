import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  try {
    const response: any = await $fetch(`${baseApi}/documents/public-key.php`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la récupération de la clé publique'
    })
  }
})
