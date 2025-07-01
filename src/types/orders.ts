export interface Order extends Record<string, unknown> {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  experience_title: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_date: string
  experience_date?: string
  participants: number
} 