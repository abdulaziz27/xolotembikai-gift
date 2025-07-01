import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName } = body

    if (!email || !firstName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and first name are required' 
      }, { status: 400 })
    }

    // Cek apakah user sudah ada
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser.users?.find(user => user.email === email)

    let user = userExists

    if (!userExists) {
      // Buat user baru tanpa password (guest auto-register)
      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true, // ✅ Force auto-confirm untuk guest checkout
        user_metadata: { 
          full_name: firstName + (lastName ? ' ' + lastName : ''),
          created_via: 'guest_checkout',
          needs_password_setup: true
        }
      })

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create account' 
        }, { status: 500 })
      }

      user = newUserData.user
    }

    // Generate password setup link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/setup-password`
      }
    })

    if (linkError) {
      console.error('Error generating link:', linkError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate setup link' 
      }, { status: 500 })
    }

    // Kirim welcome email dengan password setup
    try {
      await resend.emails.send({
        from: 'Xolotembikai Gift <noreply@xolotembikai.com>',
        to: [email],
        subject: 'Welcome! Setup Your Account Password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Welcome to Xolotembikai Gift, ${firstName}!</h1>
            
            <p>Thank you for your purchase! Your gift has been processed successfully.</p>
            
            <p>We've created an account for you so you can:</p>
            <ul>
              <li>Track your orders</li>
              <li>View purchase history</li>
              <li>Manage your gifts</li>
            </ul>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Setup Your Password</h3>
              <p>Click the button below to set your password and access your account:</p>
              <a href="${linkData.properties.action_link}" 
                 style="display: inline-block; background: linear-gradient(to right, #7c3aed, #f97316); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Setup Password
              </a>
            </div>
            
            <p>If you have any questions, feel free to contact us.</p>
            
            <p>Best regards,<br>The Xolotembikai Gift Team</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Don't fail the checkout if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: userExists ? 'Welcome back! Order processed.' : 'Account created! Check your email to setup password.',
      user_created: !userExists
    })

  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 