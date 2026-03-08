import type { UseFetchOptions } from 'nuxt/app'

/**
 * Composable useApi
 */
export const useApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useFetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },

    onResponse({ response }) {
      // Intercepteur de réponse global
    },

    onResponseError({ response }) {
      // Gestionnaire d'erreurs global
      if (response.status === 401) {
        // Gérer le cas non autorisé (redirection vers login ou nettoyage du store)
        // const auth = useAuthStore()
        // auth.user = null
      }
    }
  })
}
