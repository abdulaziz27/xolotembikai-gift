import { createClient } from './client'
import { createClient as createServerClient } from './server'
import { LoginData, SignupData } from '@/types/auth'

// Client-side auth functions
export async function signInWithEmail(data: LoginData) {
  const supabase = createClient()
  
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })
  
  return { data: authData, error }
}

export async function signUpWithEmail(data: SignupData) {
  const supabase = createClient()
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      }
    }
  })
  
  return { data: authData, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Server-side auth functions
export async function getServerSession() {
  const supabase = await createServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getServerUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
} 