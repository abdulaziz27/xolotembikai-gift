export interface User extends Record<string, unknown> {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin' | 'vendor'
  status: 'active' | 'inactive' | 'suspended'
  last_sign_in?: string
  created_at: string
  total_orders?: number
} 