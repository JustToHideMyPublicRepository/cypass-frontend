import { defineStore } from 'pinia'
import { useAuthStore } from '../back/user/auth'
import { useUserDocsentryStore } from '../back/user/docsentry'
import { useUserVigitechStore } from '../back/user/vigitech'
import { usePublicVigitechStore } from '../back/public/vigitech'
import { shortcutsData } from '@/data/shortcuts'
import { faqCategories } from '@/data/faq'
import { supportData } from '@/data/support'

interface SearchResult {
  id: string
  title: string
  description?: string
  path?: string
  icon?: string
  type: 'shortcuts' | 'navigation' | 'docsentry' | 'vigitech' | 'incident' | 'log' | 'faq' | 'support'
  category?: string
  isShortcut?: boolean
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    isOpen: false,
    query: '',
    results: [] as SearchResult[],
    isLoading: false,
    recentSearches: [] as SearchResult[],
    recentQueries: [] as string[]
  }),

  actions: {
    toggleSearch() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.query = ''
        this.results = []
      }
    },

    openSearch() {
      this.isOpen = true
      this.query = ''
      this.results = []
    },

    closeSearch() {
      this.isOpen = false
    },

    loadRecentSearches() {
      if (process.client) {
        // Résultats cliqués
        const savedResults = localStorage.getItem('cps_global_search')
        if (savedResults) {
          try {
            this.recentSearches = JSON.parse(savedResults)
          } catch (e) {
            console.error('Failed to parse recent searches', e)
          }
        }
        // Thèmes de recherche
        const savedQueries = localStorage.getItem('cps_search_queries')
        if (savedQueries) {
          try {
            this.recentQueries = JSON.parse(savedQueries)
          } catch (e) {
            console.error('Failed to parse recent queries', e)
          }
        }
      }
    },

    saveRecentSearches() {
      if (process.client) {
        localStorage.setItem('cps_global_search', JSON.stringify(this.recentSearches))
        localStorage.setItem('cps_search_queries', JSON.stringify(this.recentQueries))
      }
    },

    addRecentQuery(query: string) {
      if (!query || query.length < 2) return

      // Éviter les doublons
      this.recentQueries = this.recentQueries.filter(q => q.toLowerCase() !== query.toLowerCase())

      // Ajouter au début
      this.recentQueries.unshift(query)

      // Limiter à 5
      if (this.recentQueries.length > 5) {
        this.recentQueries = this.recentQueries.slice(0, 5)
      }

      this.saveRecentSearches()
    },

    removeRecentQuery(query: string) {
      this.recentQueries = this.recentQueries.filter(q => q !== query)
      this.saveRecentSearches()
    },

    addRecentSearch(result: SearchResult) {
      // Éviter les doublons basés sur l'ID
      this.recentSearches = this.recentSearches.filter(r => r.id !== result.id)

      // Ajouter au début
      this.recentSearches.unshift(result)

      // Limiter à 5 recherches récentes
      if (this.recentSearches.length > 5) {
        this.recentSearches = this.recentSearches.slice(0, 5)
      }

      this.saveRecentSearches()
    },

    removeRecentSearch(id: string) {
      this.recentSearches = this.recentSearches.filter(r => r.id !== id)
      this.saveRecentSearches()
    },

    clearRecentSearches() {
      this.recentSearches = []
      this.saveRecentSearches()
    },

    clearRecentQueries() {
      this.recentQueries = []
      this.saveRecentSearches()
    },

    async performSearch(query: string) {
      this.query = query
      if (!query || query.length < 2) {
        this.results = []
        return
      }

      this.isLoading = true
      try {
        const authStore = useAuthStore()
        const docStore = useUserDocsentryStore()
        const profStore = useProfilStore()
        const isAuthenticated = !!authStore.user
        const vigitechStore = useUserVigitechStore()
        const publicVigitechStore = usePublicVigitechStore()

        // Proactive fetching (ONLY if authenticated or for public data if empty)
        const fetchPromises = []
        if (isAuthenticated) {
          if (docStore.documents.length === 0) fetchPromises.push(docStore.fetchDocuments(100))
          if (profStore.logs.length === 0) fetchPromises.push(profStore.getUserLogs({ limit: 100 }))
          if (vigitechStore.userIncidents.length === 0) fetchPromises.push(vigitechStore.fetchUserIncidents())
        }

        // Always try to have public incidents for search
        if (publicVigitechStore.publicIncidents.length === 0) {
          fetchPromises.push(publicVigitechStore.fetchPublicIncidents())
        }

        if (fetchPromises.length > 0) {
          await Promise.all(fetchPromises)
        }

        const searchResults: SearchResult[] = []
        const q = query.toLowerCase()

        // 1. Search in Navigation/Shortcuts (ALWAYS ALLOWED)
        Object.entries(shortcutsData).forEach(([id, entry]) => {
          const label = (entry.label || '').toLowerCase()
          const path = (entry.path || '').toLowerCase()
          const group = (entry.group || '').toLowerCase()

          // Filter out navigation items that require auth if user is not logged in 
          // (though most are probably public or intended to be found)
          if (label.includes(q) || path.includes(q) || group.includes(q)) {
            const hasPath = !!entry.path
            const isShortcut = !hasPath && !!entry.keys

            searchResults.push({
              id: `nav-${id}`,
              title: entry.label,
              description: entry.group || 'Navigation',
              path: entry.path,
              type: hasPath ? 'navigation' : 'shortcuts',
              category: hasPath ? 'Page' : 'Raccourcis',
              isShortcut
            })
          }
        })

        // 2. Search in Docsentry (ONLY IF AUTHENTICATED)
        if (isAuthenticated) {
          docStore.documents.forEach(doc => {
            const filename = (doc.filename || '').toLowerCase()
            if (filename.includes(q)) {
              searchResults.push({
                id: `doc-${doc.id}`,
                title: doc.filename,
                description: `Document ${(doc.file_type || '').toUpperCase()}`,
                path: `/dashboard/docsentry/${doc.id}`,
                type: 'docsentry',
                category: 'Gestion document'
              })
            }
          })
        }

        // 3. Search in VigiTech (DASHBOARD - If AUTH)
        if (isAuthenticated) {
          vigitechStore.userIncidents.forEach(inc => {
            const title = (inc.title || '').toLowerCase()
            const desc = (inc.description || '').toLowerCase()
            if (title.includes(q) || desc.includes(q)) {
              if (!searchResults.find(r => r.id === `vigi-pub-${inc.id}`)) {
                searchResults.push({
                  id: `vigi-dash-${inc.id}`,
                  title: inc.title,
                  description: `Incident #${inc.id.toString().slice(-6)} - ${inc.created_at}`,
                  path: `/dashboard/vigitech/${inc.id}`,
                  type: 'vigitech',
                  category: 'Gestion incident'
                })
              }
            }
          })
        }

        // 4. Search in VigiTech (PUBLIC)
        publicVigitechStore.publicIncidents.forEach(inc => {
          const title = (inc.title || '').toLowerCase()
          const desc = (inc.description || '').toLowerCase()
          if (title.includes(q) || desc.includes(q)) {
            searchResults.push({
              id: `vigi-pub-${inc.id}`,
              title: inc.title,
              description: `Alerte VigiTech - ${inc.location || 'Sans localisation'}`,
              path: `/vigitech/${inc.id}`,
              type: 'incident',
              category: 'Alerte'
            })
          }
        })

        // 5. Search in Logs (ONLY IF AUTHENTICATED)
        if (isAuthenticated) {
          profStore.logs.forEach((log, index) => {
            const action = (log.action_type || '').toLowerCase()
            const label = (log.action_label || '').toLowerCase()
            let detailsStr = ''
            try {
              detailsStr = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {})
            } catch (e) {
              detailsStr = ''
            }
            detailsStr = detailsStr.toLowerCase()

            if (action.includes(q) || label.includes(q) || detailsStr.includes(q)) {
              searchResults.push({
                id: `log-${log.id || index}`,
                title: log.action_label || log.action_type || 'Activité',
                description: typeof log.details === 'string' ? log.details : (log.action_label || log.created_at),
                path: `/dashboard/activities/${log.id}`,
                type: 'log',
                category: 'Journal d\'activité'
              })
            }
          })
        }

        // 6. Search in FAQ
        faqCategories.forEach(cat => {
          cat.items.forEach(item => {
            const question = item.question.toLowerCase()
            const answer = item.answer.toLowerCase()
            if (question.includes(q) || answer.includes(q)) {
              searchResults.push({
                id: `faq-${item.question}`,
                title: item.question,
                description: item.answer.substring(0, 100) + '...',
                path: `/faq?cat=${encodeURIComponent(cat.title)}&q=${encodeURIComponent(item.question)}`,
                type: 'faq',
                category: 'Questions fréquentes'
              })
            }
          })
        })

        // 7. Search in Support
        supportData.forEach(cat => {
          cat.articles.forEach(article => {
            const title = article.title.toLowerCase()
            const content = article.content.toLowerCase()
            if (title.includes(q) || content.includes(q)) {
              searchResults.push({
                id: `support-${article.id}`,
                title: article.title,
                description: article.content.substring(0, 100) + '...',
                path: `/support/${cat.id}/${article.id}`,
                type: 'support',
                category: 'Centre d\'aide'
              })
            }
          })
        })

        this.results = searchResults
      } catch (e) {
        console.error('Search error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }
})
