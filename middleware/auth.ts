export default defineNuxtRouteMiddleware((to, from) => {
    const cypassData = useCypassData()

    if (!cypassData.currentUser && to.path.startsWith('/dashboard')) {
        return navigateTo('/auth/login')
    }
})
