import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  try {
    const response: any = await $fetch(`${baseApi}/public/docsentry/enrichieDoc_categories`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la récupération des catégories d\'enrichissement'
    })
  }
})
