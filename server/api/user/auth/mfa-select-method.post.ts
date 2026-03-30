import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)

  try {
    const formData = new FormData()
    formData.append('email', body.email)
    formData.append('method', body.method)

    const response: any = await $fetch(`${baseApi}/user/auth/mfa_select_method`, {
      method: 'POST',
      body: formData,
      headers: {
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la sélection de la méthode MFA'
    })
  }
})
