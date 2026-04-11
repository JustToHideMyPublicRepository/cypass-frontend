import { defineStore } from 'pinia'
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns'
import { type Document, type DocumentDetail, type UploadResult } from '~/types/docsentry'

export const useUserDocsentryStore = defineStore('userDocsentry', {
  state: () => ({
    documents: [] as Document[],
    loading: false,
    error: null as string | null,
    uploadResult: null as UploadResult | null,
    currentDocument: null as DocumentDetail | null,
    trend: { percentage: 0, difference: 0 },
    pagination: {
      total: 0,
      limit: 20,
      offset: 0,
      has_more: false,
      filters: {
        filename: '',
        file_type: '',
        date_start: '',
        date_end: '',
        with_versions: 'all'
      }
    }
  }),

  actions: {
    // Télécharger certificat
    async downloadCertificate(id: string, filename: string) {
      this.error = null
      try {
        const response = await $fetch('/api/user/docsentry/get-certificate', {
          query: { id },
          responseType: 'blob'
        })
        const url = window.URL.createObjectURL(response as Blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Certificat_${filename}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return true
      } catch (err: any) {
        this.error = 'Impossible de télécharger le certificat'
        if (err.data instanceof Blob) {
          try {
            const text = await err.data.text()
            const json = JSON.parse(text)
            this.error = json.message || err.message || this.error
          } catch (e) {
            this.error = err.message || this.error
          }
        } else {
          this.error = err.data?.message || err.message || this.error
        }
        console.error('Failed to download certificate', err)
        return false
      }
    },

    // Télécharger l'archive ZIP
    async downloadZip(id: string, filename: string) {
      this.error = null
      try {
        const response = await $fetch('/api/user/docsentry/download-zip', {
          query: { id },
          responseType: 'blob'
        })
        const url = window.URL.createObjectURL(response as Blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `CYPASS_archive_${filename.replace('.pdf', '')}.zip`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return true
      } catch (err: any) {
        this.error = 'Impossible de télécharger l’archive ZIP'
        if (err.data instanceof Blob) {
          try {
            const text = await err.data.text()
            const json = JSON.parse(text)
            this.error = json.message || err.message || this.error
          } catch (e) {
            this.error = err.message || this.error
          }
        } else {
          this.error = err.data?.message || err.message || this.error
        }
        console.error('Failed to download ZIP archive', err)
        return false
      }
    },

    // Récupérer les documents
    async fetchDocuments(limit: number = 20, offset: number = 0, filters: any = {}) {
      this.loading = true
      try {
        const query: any = { limit, offset }
        if (filters.filename) query.filename = filters.filename
        if (filters.file_type && filters.file_type !== 'all') query.file_type = filters.file_type
        if (filters.date_start) query.date_start = filters.date_start
        if (filters.date_end) query.date_end = filters.date_end
        if (filters.with_versions && filters.with_versions !== 'all') query.with_versions = filters.with_versions

        const response = await $fetch<{
          success: boolean;
          data: {
            documents: Document[],
            pagination: {
              total: number,
              limit: number,
              offset: number,
              has_more: boolean
            }
          }
        }>('/api/user/docsentry/list', {
          query
        })
        if (response.success) {
          this.documents = response.data.documents
          if (response.data.pagination) {
            this.pagination = {
              ...this.pagination,
              ...response.data.pagination
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch documents', err)
      } finally {
        this.loading = false
      }
    },

    // Récupérer les détails du document
    async fetchDocumentById(id: string, sort?: string, search?: string, background: boolean = false) {
      if (!background) this.loading = true
      this.error = null
      try {
        const query: any = { id }
        if (sort) query.sort = sort
        if (search) query.search = search
        const response = await $fetch<{ success: boolean; data: DocumentDetail }>('/api/user/docsentry/get', {
          query
        })
        if (response.success) {
          this.currentDocument = response.data
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Impossible de récupérer les détails du document'
        return false
      } finally {
        if (!background) this.loading = false
      }
    },

    // Certifier un document
    async uploadDocument(file: File) {
      this.loading = true
      this.error = null
      this.uploadResult = null

      try {
        const formData = new FormData()
        formData.append('document', file)

        const response = await $fetch<{ success: boolean; message: string; data: UploadResult }>('/api/user/docsentry/certificate', {
          method: 'POST',
          body: formData
        })

        if (response.success) {
          this.uploadResult = response.data
          // Refresh list if we had one
          await this.fetchDocuments()
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de l’authentification du document'
        return false
      } finally {
        this.loading = false
      }
    },

    // Générer des versions enfants (multi-version)
    async generateMultiVersion(params: { document_id: string; recipients_csv?: File; recipients_manual?: string }) {
      this.error = null

      try {
        const formData = new FormData()
        formData.append('document_id', params.document_id)

        if (params.recipients_csv) {
          formData.append('recipients_csv', params.recipients_csv)
        }

        if (params.recipients_manual) {
          formData.append('recipients_manual', params.recipients_manual)
        }

        const response = await $fetch<{ success: boolean; message: string }>('/api/user/docsentry/multi-version', {
          method: 'POST',
          body: formData
        })

        if (response.success) {
          return true
        }
        this.error = response.message
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors du lancement du traitement multi-version'
        return false
      }
    },

    // Calculer les tendances
    async fetchTrend() {
      try {
        const now = new Date()
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
        const previousWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
        const previousWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })

        const response = await $fetch<any>('/api/user/docsentry/list', {
          query: { limit: 100, offset: 0 }
        })

        const docs = response?.data?.documents || []

        const currentWeekCount = docs.filter((d: any) => {
          const date = new Date(d.created_at)
          return isWithinInterval(date, { start: currentWeekStart, end: now })
        }).length

        const previousWeekCount = docs.filter((d: any) => {
          const date = new Date(d.created_at)
          return isWithinInterval(date, { start: previousWeekStart, end: previousWeekEnd })
        }).length

        const diff = currentWeekCount - previousWeekCount
        this.trend = {
          percentage: previousWeekCount === 0 ? (currentWeekCount > 0 ? 100 : 0) : Math.round((diff / previousWeekCount) * 100),
          difference: diff
        }
      } catch (err) {
        console.error('Failed to calculate document trend', err)
      }
    },
  }
})
