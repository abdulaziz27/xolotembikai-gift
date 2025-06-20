export const APP_NAME = 'Xolotembikai Gift'
export const APP_DESCRIPTION = 'Experience gifts that create lasting memories'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ABOUT: '/about',
  FAQ: '/faq',
  CONTACT: '/contact',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    CALLBACK: '/api/auth/callback',
  },
  TEST: '/api/test',
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  SIGNUP_FAILED: 'Failed to create account',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const 