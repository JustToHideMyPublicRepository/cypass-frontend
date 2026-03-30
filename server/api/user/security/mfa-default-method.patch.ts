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
    formData.append('method', body.method)

    const response: any = await $fetch(`${baseApi}/user/security/mfa_default_method`, {
      method: 'PATCH' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: formData
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la mise à jour de la méthode par défaut'
    })
  }
})
