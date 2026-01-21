import type { UseFetchOptions } from 'nuxt/app'

/**
 * useApi composable
 * 
 * This composable is a wrapper around useFetch that targets our internal /api routes.
 * These internal routes act as a proxy to the backend and handle HttpOnly cookies.
 */
export const useApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useFetch(url, {
    ...options,
    // Base URL is omitted because we target our own /api routes
    headers: {
      ...options.headers,
    },

    onResponse({ response }) {
      // Global response interceptor if needed
    },

    onResponseError({ response }) {
      // Global error handler
      if (response.status === 401) {
        // Handle unauthorized (redirect to login or clear store)
        // const auth = useAuthStore()
        // auth.user = null
      }
    }
  })
}
