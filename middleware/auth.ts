export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (!auth.user && to.path.startsWith('/dashboard')) {
        return navigateTo('/auth/login')
    }
})
