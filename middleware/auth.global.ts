import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    // Log pour le debug (sera visible dans la console du navigateur)
    // console.log('Auth middleware running for path:', to.path, 'User:', !!auth.user)

    // Si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard
    if (!auth.user && to.path.startsWith('/dashboard')) {
        return navigateTo('/auth/login')
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages d'authentification
    if (auth.user && to.path.startsWith('/auth')) {
        return navigateTo('/dashboard')
    }
})
