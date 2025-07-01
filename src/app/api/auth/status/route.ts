import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        authenticated: false,
        user: null,
        profile: null
      })
    }

    // Try to get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Fallback to user metadata if profile not found
    const userProfile = profile || {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || 'User',
      role: user.user_metadata?.role || 'user',
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile: userProfile
    })

  } catch (error: any) {
    console.error('Auth status error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
} 