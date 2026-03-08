import { defineEventHandler, readBody, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const body = await readBody(event)
  const token = getCookie(event, 'cypass_token')

  try {
    // Convert body to form-urlencoded for PHP backend
    const params = new URLSearchParams()
    if (body.confirm) params.append('confirm', 'true')
    if (body.current_password) params.append('current_password', body.current_password)

    const response: any = await $fetch(`${baseApi}/profile/delete_account.php`, {
      method: 'DELETE' as any,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: params.toString()
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Erreur lors de la suppression'
    })
  }
})
