import type { UseFetchOptions } from 'nuxt/app'

/**
 * Composable useApi
 * 
 * Ce composable est une surcouche autour de useFetch qui cible les routes /api internes.
 * Ces routes internes servent de proxy vers le backend et gèrent les cookies HttpOnly.
 */
export const useApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useFetch(url, {
    ...options,
    // L'URL de base est omise car nous ciblons nos propres routes /api
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
