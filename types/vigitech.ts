export type IncidentType = 'phishing' | 'ransomware' | 'fake_profile' | 'harassment' | 'other'
export type ThreatLevel = 'low' | 'medium' | 'critical'
export type IncidentStatus = 'validated' | 'rejected' | 'blocked'

export interface Incident {
  id: string
  user_id?: string
  is_anonymous: boolean | number
  title: string
  description: string
  type: IncidentType
  threat_level: ThreatLevel
  evidence_file: string | null
  location: string
  status: IncidentStatus
  is_blocked: boolean | number
  blocking_reason: string | null
  is_reported?: boolean | number
  created_at: string
  updated_at?: string | null
  reporter_organization?: string
  pending_reports_count?: number
}

export interface CreateIncidentRequest {
  title: string
  description: string
  type: IncidentType
  threat_level: ThreatLevel
  is_anonymous: boolean
  location: string
  evidence?: File | null
}
