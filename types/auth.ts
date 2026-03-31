export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  organization: string | null
  avatar_url: string | null
  role: string
  mfa_enabled: boolean
  mfa_active?: boolean
  mfa_disabled_until?: string | null
  mfa_method?: string
  mfa_default_method?: string
  has_security_codes?: boolean
  created_at: string
}

export interface AuthState {
  user: User | null
  mfaSession: {
    email: string
    loginTime: number
    available_methods: string[]
    default_method: string | null
    active_method: string | null
  } | null
  loading: boolean
  initialized: boolean
  error: string | null
  message: string | null
}
