import { defineEventHandler, getCookie, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'cypass_token')
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const response = await $fetch(`${baseApi}/user/security/mfaMtd_sec_codes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: {
        password: body.password
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
