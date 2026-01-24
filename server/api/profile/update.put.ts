import { defineEventHandler, readBody, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'cypass_token')
  const body = await readBody(event)

  try {
    // Backend expects application/x-www-form-urlencoded
    const params = new URLSearchParams()
    if (body.first_name) params.append('first_name', body.first_name)
    if (body.last_name) params.append('last_name', body.last_name)
    if (body.organization_name) params.append('organization_name', body.organization_name)

    const response: any = await $fetch(`${config.public.cypassBaseAPI}/api/profile/update_profile.php`, {
      method: 'PUT' as 'PUT',
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
