import { defineStore } from 'pinia'
import { shortcutsData } from '@/data/shortcuts'
import { useDocumentsStore } from './documents'

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
      const searchResults: SearchResult[] = []

      // 1. Search in Navigation/Shortcuts
      const q = query.toLowerCase()
      Object.entries(shortcutsData).forEach(([id, entry]) => {
        if (
          entry.label.toLowerCase().includes(q) ||
          (entry.path && entry.path.toLowerCase().includes(q)) ||
          (entry.group && entry.group.toLowerCase().includes(q))
        ) {
          searchResults.push({
            id: `nav-${id}`,
            title: entry.label,
            description: entry.group || 'Navigation',
            path: entry.path,
            type: 'navigation',
            category: entry.group
          })
        }
      })

      // 2. Search in Documents (local for now, could be extended to API)
      const docStore = useDocumentsStore()
      docStore.documents.forEach(doc => {
        if (doc.filename.toLowerCase().includes(q)) {
          searchResults.push({
            id: `doc-${doc.id}`,
            title: doc.filename,
            description: `Document ${doc.file_type.toUpperCase()}`,
            path: `/dashboard/docsentry?id=${doc.id}`,
            type: 'document',
            category: 'Documents'
          })
        }
      })

      // Limit results
      this.results = searchResults.slice(0, 10)
      this.isLoading = false
    }
  }
})
