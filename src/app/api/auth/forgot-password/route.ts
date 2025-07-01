import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Starting password reset process...')
    
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)
    
    console.log('Sending reset password email via Supabase...')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })

    if (error) {
      console.error('Error sending reset email:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send reset email' 
      }, { status: 500 })
    }

    console.log('Reset password email sent successfully')
    
    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({ 
      success: true, 
      message: 'If that email exists, we sent a reset link' 
    })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
} 