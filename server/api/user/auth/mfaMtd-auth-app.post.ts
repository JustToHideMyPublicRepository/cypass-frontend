import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)

  try {
    const formData = new FormData()
    formData.append('email', body.email)
    formData.append('code', body.code)

    const response: any = await $fetch(`${baseApi}/user/auth/mfaMtd_auth_app`, {
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
      message: error.data?.message || 'Code Authenticator invalide ou expiré'
    })
  }
})
