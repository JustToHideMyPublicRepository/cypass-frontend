import { defineStore } from 'pinia'
import { type VerificationResult, type PublicKeyInfo } from '~/types/documents'

export const usePublicDocsentryStore = defineStore('publicDocsentry', {
  state: () => ({
    loading: false,
    error: null as string | null,
    verificationResult: null as VerificationResult | null,
    publicKeyInfo: null as PublicKeyInfo | null,
  }),

  actions: {
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
        const response = await $fetch<VerificationResult & { success: boolean }>('/api/public/docsentry/verify-hash', {
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

        const response = await $fetch<VerificationResult & { success: boolean }>('/api/public/docsentry/verify-file', {
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
