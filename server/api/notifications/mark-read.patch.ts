import { defineEventHandler, getCookie, createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const body = await readBody(event)

  try {
    // Backend uses URLSearchParams for PATCH mark_as_read.php
    const formData = new URLSearchParams()
    if (body.id) formData.append('id', body.id)
    if (body.all) formData.append('all', body.all)

    const response: any = await $fetch(`${baseApi}/notifications/mark_as_read.php`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur marquage lecture'
    })
  }
})
