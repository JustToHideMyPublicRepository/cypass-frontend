import { useAuthStore } from '~/stores/back/user/auth'
import { useWorkspaceStore } from '~/stores/back/user/workspace'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()

  // Si l'auth n'est pas encore initialisée
  if (!auth.initialized) {
    await auth.verifyToken()
  }

  // Si l'utilisateur n'est pas connecté
  if (!auth.user && to.path.startsWith('/dashboard')) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }

  // Si l'utilisateur est connecté
  if (auth.user && to.path.startsWith('/auth')) {
    const wsStore = useWorkspaceStore()
    return navigateTo(`/dashboard/${wsStore.activeWorkspace?.slug || ''}`)
  }
})
