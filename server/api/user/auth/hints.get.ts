import { defineEventHandler, getCookie, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  
  // Get all cookies from the request
  const cookie = getHeader(event, 'cookie')

  try {
    const response = await $fetch<{ success: boolean; data: any; message: string }>(`${baseApi}/user/auth/hints`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookie || ''
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.statusMessage || 'Internal Server Error'
    })
  }
})
