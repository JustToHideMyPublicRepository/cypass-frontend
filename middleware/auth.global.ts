import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useAuthStore()

    // Si l'auth n'est pas encore initialisée
    if (!auth.initialized) {
        await auth.initAuth()
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard
    if (!auth.user && to.path.startsWith('/dashboard')) {
        return navigateTo('/auth/login')
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages d'authentification
    if (auth.user && to.path.startsWith('/auth')) {
        return navigateTo('/dashboard')
    }
})
