export interface ContactRequestPayload {
  full_name: string
  email: string
  subject: string
  message: string
}

export interface PartnershipRequestPayload {
  organization_name: string
  contact_name: string
  email: string
  message: string
}

export interface SupportResponseData {
  id: string
  ticket: string
}

export interface SupportSuccessResponse {
  success: true
  message: string
  data: SupportResponseData
}

export interface SupportErrorResponse {
  success: false
  message: string
}

export type SupportResponse = SupportSuccessResponse | SupportErrorResponse
