export interface Subscription {
  id: string
  user_id: string
  fedapay_id: string
  amount: number | string
  currency: string
  status: 'approved' | 'declined' | 'canceled' | 'pending'
  package_name: string
  payment_method?: string
  credits_awarded: number
  metadata: {
    transaction_id: number | string
    token: string
    url: string
  }
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SubscriptionResponse<T> {
  success: boolean
  data: T
  message: string
  execution_time?: string
}
