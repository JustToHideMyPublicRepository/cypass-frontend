export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()

  // Initialize auth only once on the server or on the client
  if (import.meta.server || !auth.user) {
    await auth.initAuth()
  }
})
