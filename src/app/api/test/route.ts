import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test simple query (will work even without tables)
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString(),
      hasSession: !!data.session
    })
  } catch (err) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to connect to Supabase',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
} 