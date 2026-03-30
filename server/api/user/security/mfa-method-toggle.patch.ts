import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }

  const body = await readBody(event)

  try {
    const response: any = await $fetch(`${baseApi}/user/security/mfa_method_toggle`, {
      method: 'PATCH',
      body,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la mise à jour de la méthode MFA'
    })
  }
})
