import { LoginData, SignupData } from '@/types/auth'

export function validateLogin(data: LoginData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid'
  }
  
  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateSignup(data: SignupData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  if (!data.name) {
    errors.name = 'Name is required'
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid'
  }
  
  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
} 