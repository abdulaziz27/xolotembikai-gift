import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName } = body

    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single()

    if (userError || !existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (existingUser.role === "admin") {
      return NextResponse.json(
        { error: "User is already an admin" },
        { status: 400 }
      )
    }

    // Update user role to admin
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", email)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
} 