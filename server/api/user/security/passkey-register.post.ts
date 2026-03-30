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
    // Laragear/WebAuthn expects the raw JSON response from the credential ceremony
    // + an optional 'name' field.
    const response: any = await $fetch(`${baseApi}/user/security/passkey_register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: body
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de l\'enregistrement de la Passkey'
    })
  }
})
