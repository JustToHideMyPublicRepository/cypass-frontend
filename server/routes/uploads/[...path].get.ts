import { defineEventHandler, getRouterParam, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')
  const targetUrl = `${config.cypassBaseAPI}/uploads/${path}`

  try {
    const response = await $fetch.raw(targetUrl, {
      method: 'GET',
      responseType: 'stream'
    })

    // Forward headers
    const contentType = response.headers.get('content-type')
    if (contentType) {
      setHeader(event, 'Content-Type', contentType)
    }

    // Cache control for images
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return sendStream(event, response._data as any)
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }
})
