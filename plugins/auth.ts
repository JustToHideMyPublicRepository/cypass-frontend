export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  const profil = useProfilStore()

  // Initialize auth only once on the server or on the client
  if (import.meta.server || !auth.user) {
    await auth.verifyToken()
  }

  if (auth.user) {
    const workspace = useWorkspaceStore()
    if (!workspace.activeWorkspace) {
      // Ensure workspace store is initialized
      await workspace.initWorkspace()
    }

    if (!profil.profile) {
      await profil.getProfile()
    }
  }
})
