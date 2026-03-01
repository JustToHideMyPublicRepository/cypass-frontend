import { defineEventHandler, readBody, createError, type H3Event } from 'h3'

interface ResendMfaResponse {
  success: boolean
  data?: {
    require_mfa: boolean
    email: string
  }
  message: string
}

export default defineEventHandler(async (event: H3Event): Promise<ResendMfaResponse> => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }

  try {
    const response = await $fetch<ResendMfaResponse>(`${baseApi}/auth/resend_mfa.php`, {
      method: 'POST',
      body: new URLSearchParams(body).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
