import { defineEventHandler, getCookie, createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const body = await readBody(event)

  try {
    const formData = new URLSearchParams()
    if (body.security !== undefined) formData.append('security', String(body.security))
    if (body.documents !== undefined) formData.append('documents', String(body.documents))
    if (body.incidents !== undefined) formData.append('incidents', String(body.incidents))
    if (body.profile !== undefined) formData.append('profile', String(body.profile))

    const response: any = await $fetch(`${baseApi}/user/notification/setting_set`, {
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
      message: error.data?.message || 'Erreur mise à jour préférences notifications'
    })
  }
})
