import { defineEventHandler, readBody, createError, type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI

  try {
    const formData = new FormData()
    if (body.first_name) formData.append('first_name', body.first_name)
    if (body.last_name) formData.append('last_name', body.last_name)
    formData.append('email', body.email)

    const response = await $fetch<{ success: boolean; message: string; data: any }>(`${baseApi}/public/newsletter/subscribe`, {
      method: 'POST',
      body: formData
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
