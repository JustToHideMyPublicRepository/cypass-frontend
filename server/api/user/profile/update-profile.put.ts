import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)
  const token = getCookie(event, 'cypass_token')

  try {
    const params = new URLSearchParams()
    if (body.first_name) params.append('first_name', body.first_name)
    if (body.last_name) params.append('last_name', body.last_name)
    if (body.organization_name) params.append('organization_name', body.organization_name)

    const response: any = await $fetch(`${baseApi}/profile/update_profile.php`, {
      method: 'PUT' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la mise à jour du profil'
    })
  }
})
