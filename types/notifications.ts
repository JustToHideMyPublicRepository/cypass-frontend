export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  priority: 'standard' | 'high' | 'low'
  is_read: number | boolean
  created_at: string
}

export interface NotificationResponse {
  notifications: Notification[]
  pagination: {
    limit: number
    offset: number
    has_more: boolean
  }
  meta: {
    unread_count: number
  }
}
