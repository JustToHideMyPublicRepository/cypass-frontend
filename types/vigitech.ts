export type IncidentType = 'phishing' | 'ransomware' | 'fake_profile' | 'harassment' | 'other'
export type ThreatLevel = 'low' | 'medium' | 'critical'
export type IncidentStatus = 'validated' | 'rejected' | 'blocked'
export type ReactionType = 'love' | 'like' | 'wow' | 'dislike' | 'sad'

export type ReactionSummary = Partial<Record<ReactionType, number>>

export interface Reaction {
  id: string
  user_id: string
  reactable_id: string
  reactable_type: string
  type: ReactionType
  created_at: string
  updated_at: string
}

export interface ReactionDetail {
  type: ReactionType
  user_id: string
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
}

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
  deleted_at?: string | null
  scheduled_deletion_at?: string | null
  reporter_organization?: string | null
  pending_reports_count?: number
  views_count?: number
  comments_count?: number
  reactions_count?: number
  reactions_summary?: ReactionSummary
  reactions_details?: ReactionDetail[]
  author_first_name?: string | null
  author_last_name?: string | null
  author_is_reported?: boolean | number
  user_avatar?: string | null
  author_avatar_url?: string | null
}

export interface Comment {
  id: string
  incident_id: string
  parent_id?: string | null
  user_id: string
  content: string
  created_at: string
  updated_at?: string | null
  first_name?: string | null
  last_name?: string | null
  organization_name?: string | null
  avatar_url?: string | null
  incident_title?: string | null
  replies_count?: number
  reactions_count?: number
  reactions_summary?: any | null
  replies?: Comment[]
  is_verified?: boolean | number
  reporter_organization?: string | null
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
