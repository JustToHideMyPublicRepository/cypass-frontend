import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email requis'
    })
  }

  try {
    const response = await $fetch(`${baseApi}/api/auth/resend_verification.php`, {
      method: 'POST',
      body: new URLSearchParams({ email: body.email })
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
