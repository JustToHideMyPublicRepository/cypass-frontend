import { defineEventHandler, sendStream, setHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Get the requested path (e.g., /uploads/avatars/foo.png)
  const fullPath = event.path || ''
  const pathWithoutQuery = fullPath.split('?')[0]

  // Extract the relative part (e.g., avatars/foo.png)
  const relativePath = pathWithoutQuery.replace(/^\/uploads\//, '')

  if (!relativePath || relativePath === pathWithoutQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: `Chemin d'upload invalide: ${fullPath}`
    })
  }

  // Construct the clean backend root URL
  const apiBase = (config.cypassBaseAPI || '').trim().replace(/\/+$/, '')
  const backendRoot = apiBase.replace(/\/api$/i, '')

  // Final target URL
  const targetUrl = `${backendRoot}/uploads/${relativePath}`

  try {
    const response = await $fetch.raw(targetUrl, {
      method: 'GET',
      responseType: 'stream',
      headers: {
        'Accept': '*/*',
      }
    })

    // Forward essential headers
    const contentType = response.headers.get('content-type')
    if (contentType) {
      setHeader(event, 'Content-Type', contentType)
    }

    // Add debugging headers for visibility
    setHeader(event, 'X-Proxy-Backend', targetUrl)
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return sendStream(event, response._data as any)
  } catch (error: any) {
    // Return a structured error if the backend fails
    throw createError({
      statusCode: error.response?.status || 404,
      statusMessage: `Erreur Proxy Upload - Target: ${targetUrl}`,
      data: {
        target: targetUrl,
        message: error.message
      }
    })
  }
})
