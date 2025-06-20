import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateLogin } from '@/lib/validations/auth'
import { AUTH_ERRORS } from '@/lib/utils/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const { isValid, errors } = validateLogin(body)
    if (!isValid) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }
    
    // Attempt login with Supabase
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: AUTH_ERRORS.INVALID_CREDENTIALS 
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      }
    })
    
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { 
        success: false, 
        error: AUTH_ERRORS.UNKNOWN_ERROR 
      },
      { status: 500 }
    )
  }
} 