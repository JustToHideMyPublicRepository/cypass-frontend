import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }

  try {
    const formData = new FormData()
    formData.append('code', body.code)

    const response: any = await $fetch(`${baseApi}/user/security/authenticator_confirm`, {
      method: 'POST' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: formData
    })

    return response
  } catch (error: any) {
    // Return the response directly if it's a validation error (422) or similar
    if (error.response?.status === 422 || error.response?.status === 400) {
      return error.data
    }
    
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la confirmation du code'
    })
  }
})
