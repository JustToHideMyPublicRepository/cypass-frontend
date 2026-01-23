import { defineEventHandler, getCookie, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'cypass_token')
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.public.cypassBaseAPI

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const response = await $fetch(`${baseApi}/api/profile/change_email.php`, {
      method: 'PUT' as any,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({
        new_email: body.new_email,
        current_password: body.current_password
      })
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
