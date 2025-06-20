// Main types export
export * from './auth'

// Common types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface NavItem {
  name: string
  href: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 