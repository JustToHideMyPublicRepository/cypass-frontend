import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseApi = config.cypassBaseAPI
  const query = getQuery(event)

  try {
    const response = await $fetch(`${baseApi}/vigitech/get_all.php`, {
      query
    })
    return response
  } catch (err: any) {
    return { success: false, data: [], message: err.message }
  }
})
