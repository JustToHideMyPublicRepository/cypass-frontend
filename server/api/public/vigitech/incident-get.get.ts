import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const id = event.context.params?.id || getQuery(event).id as string

  try {
    const response = await $fetch(`${baseApi}/public/vigitech/get_incident/${id}`)
    return response
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      message: 'Incident non trouvé'
    })
  }
})
