import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string()
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = signupSchema.parse(body)

    // Use admin client to create confirmed user
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create user with admin client (auto-confirmed)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: name
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json({ 
        success: false, 
        error: authError.message 
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create user' 
      }, { status: 400 })
    }

    // Create profile in profiles table using admin client
    const supabase = await createClient()
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: authData.user.email,
        full_name: name,
        role: 'user'
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't return error here as auth user is already created
    }

    // Try to send welcome email (optional, don't fail if it doesn't work)
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Xolotembikai Gift <noreply@xolotembikai.com>',
          to: [email],
          subject: 'Welcome to Xolotembikai Gift!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #7c3aed;">Welcome to Xolotembikai Gift, ${name}!</h1>
              
              <p>Thank you for joining Xolotembikai Gift! We're excited to have you as part of our community.</p>
              
              <p>With your new account, you can:</p>
              <ul>
                <li>Browse and purchase unique gift experiences</li>
                <li>Track your orders</li>
                <li>Create wishlists</li>
                <li>Manage your profile and preferences</li>
              </ul>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Get Started</h3>
                <p>Click the button below to explore our gift experiences:</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/experiences" 
                   style="display: inline-block; background: linear-gradient(to right, #7c3aed, #f97316); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Explore Gifts
                </a>
              </div>
              
              <p>If you have any questions or need assistance, our support team is here to help.</p>
              
              <p>Best regards,<br>The Xolotembikai Gift Team</p>
            </div>
          `
        })
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue anyway
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully!',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name
      }
    })

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create account' 
    }, { status: 500 })
  }
} 