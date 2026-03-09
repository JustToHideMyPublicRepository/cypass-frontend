import { defineStore } from 'pinia'
import { type CryptographicProof, type Document, type DocumentDetail, type UploadResult, type VerificationResult, type PublicKeyInfo } from '../types/documents'

export const useDocsentryStore = defineStore('docsentry', {
  state: () => ({
    documents: [] as Document[],
    loading: false,
    error: null as string | null,
    uploadResult: null as UploadResult | null,
    verificationResult: null as VerificationResult | null,
    publicKeyInfo: null as PublicKeyInfo | null,
    currentDocument: null as DocumentDetail | null,
    pagination: {
      total: 0,
      limit: 20,
      offset: 0,
      has_more: false,
      filters: {
        filename: '',
        file_type: '',
        date_start: '',
        date_end: ''
      }
    }
  }),

  actions: {
    // Récupérer les détails du document
    async fetchDocumentById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ success: boolean; data: DocumentDetail }>('/api/user/docsentry/get', {
          query: { id }
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
        this.loading = false
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

    // Upload document
    async uploadDocument(file: File) {
      this.loading = true
      this.error = null
      this.uploadResult = null

      try {
        const formData = new FormData()
        formData.append('document', file)

        const response = await $fetch<{ success: boolean; message: string; data: UploadResult }>('/api/user/docsentry/upload', {
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













    // Télécharger certificat
    async downloadCertificate(id: string, filename: string) {
      try {
        const response = await $fetch('/api/public/docsentry/download', {
          query: { id, type: 'certificate' },
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
      } catch (err) {
        console.error('Failed to download certificate', err)
        return false
      }
    },

    // Récupérer la clé publique
    async fetchPublicKey() {
      try {
        const response = await $fetch<PublicKeyInfo>('/api/public/docsentry/public-key')
        if (response.success) {
          this.publicKeyInfo = response
        }
      } catch (err) {
        console.error('Failed to fetch public key', err)
      }
    },

    // Vérifier par code QR    
    async verifyDocumentByQR(file: File) {
      this.loading = true
      this.error = null
      this.verificationResult = null

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await $fetch<VerificationResult & { success: boolean }>('/api/public/docsentry/verify-qr-image', {
          method: 'POST',
          body: formData
        })

        if (response.success || response.verified !== undefined) {
          this.verificationResult = response
          return true
        }

        return false
      } catch (err: any) {
        const failureData = err.data?.data || err.data
        if (failureData && (failureData.verified !== undefined || failureData.success !== undefined)) {
          this.verificationResult = failureData
          return true
        }
        this.error = err.data?.message || err.message || 'Erreur lors de la vérification du QR Code'
        return false
      } finally {
        this.loading = false
      }
    },

    // Vérifier par hash 
    async verifyDocumentByHash(hash: string) {
      this.loading = true
      this.error = null
      this.verificationResult = null

      try {
        const response = await $fetch<VerificationResult & { success: boolean }>('/api/public/docsentry/verify', {
          method: 'GET',
          query: { h: hash }
        })

        if (response.success || response.verified !== undefined) {
          this.verificationResult = response
          return true
        }

        return false
      } catch (err: any) {
        const failureData = err.data?.data || err.data
        if (failureData && (failureData.verified !== undefined || failureData.success !== undefined)) {
          this.verificationResult = failureData
          return true
        }
        this.error = err.data?.message || err.message || 'Hash invalide ou document inconnu'
        return false
      } finally {
        this.loading = false
      }
    },

    // Vérifier par document
    async verifyDocumentFull(originalFile: File | null, certificateFile: File | null) {
      this.loading = true
      this.error = null
      this.verificationResult = null

      try {
        const formData = new FormData()
        if (originalFile) formData.append('original_file', originalFile)
        if (certificateFile) formData.append('certificate_file', certificateFile)

        const response = await $fetch<VerificationResult & { success: boolean }>('/api/public/docsentry/verify', {
          method: 'POST',
          body: formData
        })

        if (response.success || response.verified !== undefined) {
          this.verificationResult = response
          return true
        }

        return false
      } catch (err: any) {
        const failureData = err.data?.data || err.data
        if (failureData && (failureData.verified !== undefined || failureData.success !== undefined)) {
          this.verificationResult = failureData
          return true
        }
        this.error = err.data?.message || err.message || 'Erreur lors de la vérification du document'
        return false
      } finally {
        this.loading = false
      }
    },
  }
})
