import { defineEventHandler, getHeader, createError, setHeader, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?.id
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const cookie = getHeader(event, 'cookie')

  try {
    const response = await $fetch.raw<{ success: boolean; data: any; message: string }>(`${baseApi}/user/auth/hints/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookie || ''
      }
    })

    // Forward any set-cookie headers from backend
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      setHeader(event, 'set-cookie', setCookie)
    }

    return response._data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Failed to remove hint'
    })
  }
})
