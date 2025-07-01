import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const promoteUserSchema = z.object({
  email: z.string().email()
})

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = promoteUserSchema.parse(body)

    // First, let's try to create the profiles table if it doesn't exist
    try {
      await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text UNIQUE,
            full_name text,
            role text DEFAULT 'user',
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
          );
          
          CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
        `
      })
    } catch (e) {
      console.log('Table creation attempt:', e)
    }

    // Find user by email in auth.users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch users: ' + usersError.message 
      }, { status: 500 })
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Try to update or insert profile
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Admin User',
        role: 'admin'
      })

    if (upsertError) {
      console.error('Error upserting profile:', upsertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update user role: ' + upsertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User promoted to admin successfully',
      user_id: user.id,
      email: user.email
    })

  } catch (error: any) {
    console.error('Promote user error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
} 