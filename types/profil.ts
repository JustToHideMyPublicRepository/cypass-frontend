export interface UserPlan {
  name: string
  last_subscription_at: string | null
  credits: number
}

export interface NotificationSettings {
  security: boolean
  documents: boolean
  incidents: boolean
  profile: boolean
}

export interface NewsletterSettings {
  marketing: boolean
  product: boolean
  security: boolean
}

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
  mfa_active?: boolean
  mfa_disabled_until?: string | null
  mfa_method?: string
  mfa_default_method?: string
  mfa_methods?: MfaMethodInfo[]
  has_security_codes?: boolean
  is_reported?: boolean
  plan?: UserPlan
  notification_settings?: NotificationSettings
  newsletter_settings?: NewsletterSettings
  created_at: string
}

export interface MfaMethodInfo {
  method: 'magic_link' | 'security_code' | 'totp' | 'webauthn' | string
  label: string
  is_enabled: boolean
  is_default: boolean
  created_at: string
}

export interface UserSession {
  id: string
  user_agent: string
  ip_address: string
  os: string
  browser: string
  is_current: boolean
  created_at: string
  last_used_at: string
  expires_at: string
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
  incident_id?: string
  incident_title?: string
}

export interface Statistics {
  total_documents: number
  total_incidents: number
  total_views: number
}

export interface LogEntry {
  id: string
  action_type: string
  action_label: string
  details: any
  ip_address: string
  user_agent: string
  os?: string
  browser?: string
  status: 'success' | 'failed' | 'error' | string
  created_at: string
  log_type: 'user_actions' | 'requests' | 'errors' | 'security' | string
}

export interface LogStatistics {
  total_logs: number
  by_type: Record<string, number>
  date_range: string
}

export interface ProfilState {
  profile: UserProfile | null
  statistics: Statistics | null
  logs: LogEntry[]
  logStatistics: LogStatistics | null
  logUser: { id: string; email: string; role: string } | null
  logFilters: { date: string; type: string; limit: number } | null
  currentLog: LogEntry | null
  loading: boolean
  error: string | null
  message: string | null
  isLogoutModalOpen: boolean
  newsletterLoading?: boolean
}
