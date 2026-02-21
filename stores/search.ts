import { defineStore } from 'pinia'
import { shortcutsData } from '@/data/shortcuts'
import { useDocumentsStore } from './documents'
import { useProfilStore } from './profil'
import { useAuthStore } from './auth'

interface SearchResult {
  id: string
  title: string
  description?: string
  path?: string
  icon?: string
  type: 'navigation' | 'document' | 'action'
  category?: string
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    isOpen: false,
    query: '',
    results: [] as SearchResult[],
    isLoading: false
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

    async performSearch(query: string) {
      this.query = query
      if (!query || query.length < 2) {
        this.results = []
        return
      }

      this.isLoading = true
      try {
        const authStore = useAuthStore()
        const docStore = useDocumentsStore()
        const profStore = useProfilStore()
        const isAuthenticated = !!authStore.user

        // Proactive fetching (ONLY if authenticated)
        if (isAuthenticated) {
          const fetchPromises = []
          if (docStore.documents.length === 0) fetchPromises.push(docStore.fetchDocuments(100))
          if (profStore.logs.length === 0) fetchPromises.push(profStore.fetchLogs({ limit: 100 }))

          if (fetchPromises.length > 0) {
            await Promise.all(fetchPromises)
          }
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
            searchResults.push({
              id: `nav-${id}`,
              title: entry.label,
              description: entry.group || 'Navigation',
              path: entry.path,
              type: 'navigation',
              category: 'Page'
            })
          }
        })

        // 2. Search in Documents (ONLY IF AUTHENTICATED)
        if (isAuthenticated) {
          docStore.documents.forEach(doc => {
            const filename = (doc.filename || '').toLowerCase()
            if (filename.includes(q)) {
              searchResults.push({
                id: `doc-${doc.id}`,
                title: doc.filename,
                description: `Document ${(doc.file_type || '').toUpperCase()}`,
                path: `/dashboard/docsentry/${doc.id}`,
                type: 'document',
                category: 'DocSentry'
              })
            }
          })
        }

        // 3. Search in Logs (ONLY IF AUTHENTICATED)
        if (isAuthenticated) {
          profStore.logs.forEach((log, index) => {
            const action = (log.action || '').toLowerCase()
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
                id: `log-${index}`,
                title: log.action_label || log.action || 'Activité',
                description: typeof log.details === 'string' ? log.details : (log.action_label || log.timestamp),
                path: '/dashboard/logs',
                type: 'action',
                category: 'Journal d\'activité'
              })
            }
          })
        }

        this.results = searchResults
      } catch (e) {
        console.error('Search error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }
})
