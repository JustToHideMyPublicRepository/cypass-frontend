import { defineEventHandler, getQuery, createError, type H3Event } from 'h3'

interface PublicProfileResponse {
  success: boolean
  data?: any
  message?: string
}

export default defineEventHandler(async (event: H3Event): Promise<PublicProfileResponse> => {
  const query = getQuery(event)
  const id = query.id as string
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    const response = await $fetch<PublicProfileResponse>(`${baseApi}/profile/get_public/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
