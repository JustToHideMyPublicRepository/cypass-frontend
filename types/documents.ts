export interface CryptographicProof {
  algorithm: string
  digital_signature: string
  key_fingerprint: string
}

export interface Document {
  id: string
  name: string
  hash: string
  status: string
  date: string
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
