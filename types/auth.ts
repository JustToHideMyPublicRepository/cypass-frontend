export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  organization: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  message: string | null
  isLogoutModalOpen: boolean
}
