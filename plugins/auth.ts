export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  const profil = useProfilStore()

  // Initialize auth only once on the server or on the client
  if (import.meta.server || !auth.user) {
    await auth.verifyToken()
  }

  // If authenticated, pre-fetch profile to sync avatar globally
  if (auth.user && !profil.profile) {
    await profil.getProfile()
  }
})
