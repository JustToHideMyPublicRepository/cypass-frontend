import { defineEventHandler, readMultipartFormData, createError, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const token = getCookie(event, 'cypass_token')
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID du workspace manquant'
    })
  }

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Aucune donnée fournie'
    })
  }

  const backendFormData = new FormData()
  for (const part of formData) {
    if (part.name) {
      if (part.filename) {
        // Fix: Utiliser Uint8Array pour convertir le Buffer en BlobPart compatible
        const blob = new Blob([new Uint8Array(part.data)], { type: part.type })
        backendFormData.append(part.name, blob, part.filename)
      } else {
        backendFormData.append(part.name, part.data.toString())
      }
    }
  }

  // Laravel PUT workaround
  backendFormData.append('_method', 'PUT')

  try {
    const response = await $fetch(`${baseApi}/user/workspace/update/${id}`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.data?.message || 'Erreur lors de la mise à jour du workspace'
    })
  }
})
