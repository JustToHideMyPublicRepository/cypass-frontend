import { defineEventHandler, readBody, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')

  if (!token) {
    return { success: false, message: 'Non autorisé' }
  }

  const body = await readBody(event)
  const { incident_id, all } = body

  // We need to send as multipart/form-data as per CURL
  const formData = new FormData()
  formData.append('incident_id', incident_id || '')
  formData.append('all', String(all))

  try {
    const response = await $fetch(`${baseApi}/user/vigitech/trash_restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return response
  } catch (error: any) {
    console.error('Error restoring incident:', error)
    return {
      success: false,
      message: error.data?.message || 'Erreur lors de la restauration'
    }
  }
})
