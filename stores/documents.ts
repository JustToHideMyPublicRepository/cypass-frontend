import { defineStore } from 'pinia'

interface CryptographicProof {
  algorithm: string
  digital_signature: string
  key_fingerprint: string
}

interface Document {
  id: string
  name: string
  hash: string
  status: string
  date: string
}

interface UploadResult {
  document_id: string
  doc_hash: string
  cryptographic_proof: CryptographicProof
}

interface VerificationResult {
  verified: boolean
  verification_time: string
  document: {
    id: string
    filename: string
    hash: string
    file_type: string
    signer: string
    created_at: string
  }
  signature_info: {
    algorithm: string
    key_fingerprint: string
    signed_at: string
    current_key_fingerprint: string
    key_match: boolean
  }
  message: string
  authenticity: string
}

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    documents: [] as Document[],
    loading: false,
    error: null as string | null,
    uploadResult: null as UploadResult | null,
    verificationResult: null as VerificationResult | null,
  }),

  actions: {
    async uploadDocument(file: File) {
      this.loading = true
      this.error = null
      this.uploadResult = null

      try {
        const formData = new FormData()
        formData.append('document', file)

        const response = await $fetch<{ success: boolean; message: string; data: UploadResult }>('/api/documents/upload', {
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

    async verifyDocument(file: File) {
      this.loading = true
      this.error = null
      this.verificationResult = null

      try {
        const formData = new FormData()
        formData.append('document', file)
        // Note: The backend uses the same upload endpoint for verification if it's already signed, 
        // OR we might need to handle it differently depending on backend logic.
        // Based on MD, 3.1 also uses upload.php

        const response = await $fetch<VerificationResult & { success: boolean }>('/api/documents/upload', {
          method: 'POST',
          body: formData
        })

        if (response.success) {
          this.verificationResult = response
          return true
        }
        return false
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la vérification'
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchDocuments() {
      this.loading = true
      try {
        const response = await $fetch<{ success: boolean; data: { documents: Document[] } }>('/api/documents/list')
        if (response.success) {
          this.documents = response.data.documents
        }
      } catch (err) {
        console.error('Failed to fetch documents', err)
      } finally {
        this.loading = false
      }
    }
  }
})
