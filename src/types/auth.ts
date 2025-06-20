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