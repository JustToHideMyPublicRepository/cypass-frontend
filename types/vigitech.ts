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
  reporter_organization?: string | null
  pending_reports_count?: number
  views_count?: number
  comments_count?: number
  author_first_name?: string | null
  author_last_name?: string | null
  author_is_reported?: boolean | number
}

export interface Comment {
  id: string
  incident_id: string
  user_id: string
  content: string
  created_at: string
  updated_at?: string | null
  first_name?: string | null
  last_name?: string | null
  organization_name?: string | null
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
