export interface CryptographicProof {
  algorithm: string
  digital_signature: string
  key_fingerprint: string
}

export interface Document {
  id: string
  filename: string
  hash: string
  created_at: string
  file_type: string
  type: string
  has_certificate: boolean
  has_versions: boolean
  certification_mode: 'simple' | 'enrichie'
  recipient_name?: string | null
  parent?: {
    id: string
    filename: string
    hash: string
  } | null
}

export interface SignatureInfo {
  algorithm: string
  fingerprint: string
  present: boolean
  signed_at?: string
}

export interface DocumentVersion {
  id: string
  recipient: string
  hash: string
  signed_at: string
}

export interface MultiVersionGeneration {
  generated_at: string
  recipients_count: number
  recipients: string[]
}

export interface DocumentDetail extends Document {
  signed_at: string
  signature_info: SignatureInfo
  availability: {
    certificate: boolean
    original_stored: boolean
  }
  is_zip_downloaded: boolean
  certificate_download_count: number
  certification_mode: 'simple' | 'enrichie'
  enriched_metadata?: Record<string, any>
  multi_version_generation_count: number
  multi_version_generations?: MultiVersionGeneration[]
  versions?: DocumentVersion[]
}

export interface UploadResult {
  document_id: string
  doc_hash: string
  cryptographic_proof: CryptographicProof
}

export interface VerificationResult {
  verified: boolean
  verification_time: string
  document: {
    id: string
    filename: string
    hash: string
    file_type: string
    signer: string
    created_at: string
    recipient_name: string | null
    parent: {
      id: string
      filename: string
      hash: string
    } | null
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
  error?: string
  details?: string
  doc_hash?: string
  calculated_hash?: string
  success?: boolean
  mode?: string
}

export interface PublicKeyInfo {
  success: boolean
  organization: string
  algorithm: string
  key_version: string
  public_key: {
    base64: string
    hex: string
    fingerprint: string
  }
  usage: string
  documentation: string
  created_at: string
  issued_at: string
}

export interface EnrichmentField {
  key: string
  label: string
  required: boolean
  type: string
}

export interface EnrichmentCategory {
  key: string
  label: string
  fields: EnrichmentField[]
}

export interface EnrichmentCategoriesResponse {
  success: boolean
  categories: EnrichmentCategory[]
}
