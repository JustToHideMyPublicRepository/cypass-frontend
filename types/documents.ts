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
  has_certificate: boolean
}

export interface SignatureInfo {
  algorithm: string
  fingerprint: string
  present: boolean
  signed_at?: string
}

export interface DocumentDetail extends Document {
  signed_at: string
  signature_info: SignatureInfo
  availability: {
    certificate: boolean
    original_stored: boolean
  }
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
  issued_at: string
}
