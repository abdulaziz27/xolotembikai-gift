import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    console.log('🔧 Starting auto-confirm for existing users...')

    // Get all users
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to list users' 
      }, { status: 500 })
    }

    let confirmedCount = 0
    let alreadyConfirmed = 0

    for (const user of users.users) {
      if (!user.email_confirmed_at) {
        // Auto-confirm this user
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          { 
            email_confirm: true,
            user_metadata: {
              ...user.user_metadata,
              auto_confirmed: true,
              auto_confirmed_at: new Date().toISOString()
            }
          }
        )

        if (updateError) {
          console.error(`Failed to confirm user ${user.email}:`, updateError)
        } else {
          console.log(`✅ Auto-confirmed: ${user.email}`)
          confirmedCount++
        }
      } else {
        alreadyConfirmed++
      }
    }

    console.log(`🎉 Auto-confirm completed:`)
    console.log(`   - Newly confirmed: ${confirmedCount}`)
    console.log(`   - Already confirmed: ${alreadyConfirmed}`)
    console.log(`   - Total users: ${users.users.length}`)

    return NextResponse.json({ 
      success: true, 
      message: `Auto-confirmed ${confirmedCount} users`,
      stats: {
        newly_confirmed: confirmedCount,
        already_confirmed: alreadyConfirmed,
        total_users: users.users.length
      }
    })

  } catch (error: any) {
    console.error('Fix existing users error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
} 