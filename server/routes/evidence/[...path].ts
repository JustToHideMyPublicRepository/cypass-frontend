import { defineEventHandler, sendStream, setHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Get the requested path (e.g., /evidence/vigitech/foo.png)
  const fullPath = event.path || ''
  const pathWithoutQuery = fullPath.split('?')[0]

  // Extract the relative part (e.g., vigitech/foo.png)
  const relativePath = pathWithoutQuery.replace(/^\/evidence\//, '')

  if (!relativePath || relativePath === pathWithoutQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: `Chemin d'evidence invalide: ${fullPath}`
    })
  }

  // Construct the clean backend root URL
  const apiBase = (config.cypassBaseAPI || '').trim().replace(/\/+$/, '')
  const backendRoot = apiBase.replace(/\/api(\/v\d+)?$/i, '')

  // Final target URL
  const targetUrl = `${backendRoot}/${relativePath}`

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
    throw createError({
      statusCode: error.response?.status || 404,
      statusMessage: `Erreur Proxy Evidence - Target: ${targetUrl}`,
      data: {
        target: targetUrl,
        message: error.message
      }
    })
  }
})
