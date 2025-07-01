export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  profile_id: string
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role?: 'user' | 'admin'
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface AuthError {
  message: string
  field?: string
} 