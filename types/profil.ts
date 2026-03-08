export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  organization_name: string | null
  avatar_url: string | null
  role: string
  status: 'pending' | 'active' | 'pending_delete' | 'deleted' | 'suspended'
  email_verified: boolean
  mfa_enabled: boolean
  is_reported?: boolean
  created_at: string
}

export interface ReportEntry {
  id: string
  reporter_id: string
  reported_user_id: string
  reason: string
  details: string
  status: 'pending' | 'resolved' | 'dismissed' | string
  created_at: string
  updated_at: string
  reported_name?: string
  reported_organization?: string
  reporter_name?: string
  reporter_organization?: string
}

export interface Statistics {
  total_documents: number
  total_incidents: number
  total_views: number
}

export interface LogEntry {
  id: string
  action: string
  action_label: string
  details: any
  ip_address: string
  user_agent: string
  status: 'success' | 'failed' | 'error' | string
  timestamp: string
  log_type: 'user_actions' | 'requests' | 'errors' | 'security' | string
}

export interface LogStatistics {
  total_logs: number
  by_type: Record<'user_actions' | 'requests' | 'errors' | 'security' | string, number>
  by_action: Record<string, number>
  date_range: string
}

export interface ProfilState {
  profile: UserProfile | null
  statistics: Statistics | null
  logs: LogEntry[]
  logStatistics: LogStatistics | null
  logUser: { id: string; email: string; role: string } | null
  logFilters: { date: string; type: string; limit: number } | null
  loading: boolean
  error: string | null
  message: string | null
}
