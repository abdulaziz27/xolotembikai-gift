import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Helper function to check if user is admin
async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// GET single vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    
    // Check if it's a UUID (ID) or string (slug)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    const { data: vendor, error } = await supabaseAdmin
      .from('vendors')
      .select(`
        *,
        experiences:experiences(count)
      `)
      .eq(isUUID ? 'id' : 'name', id)
      .single()

    if (error) {
      console.error('Error fetching vendor:', error)
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Add total_experiences count
    const vendorWithCounts = {
      ...vendor,
      total_experiences: vendor.experiences?.[0]?.count || 0
    }

    // Remove the nested experiences object
    delete vendorWithCounts.experiences

    return NextResponse.json(vendorWithCounts)
  } catch (error) {
    console.error('Error in GET vendor by ID:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update vendor by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      description,
      logo_url,
      website_url,
      contact_person,
      phone,
      address,
      api_integration_type,
      api_credentials,
      commission_rate,
      status,
      is_active
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Vendor name and email are required' },
        { status: 400 }
      )
    }

    const { data: vendor, error } = await supabaseAdmin
      .from('vendors')
      .update({
        name,
        email,
        description,
        logo_url,
        website_url,
        contact_person,
        phone,
        address,
        api_integration_type: api_integration_type || 'manual',
        api_credentials,
        commission_rate: commission_rate || 10.00,
        status: status || 'active',
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating vendor:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Vendor with this name or email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update vendor', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('Error in PUT vendor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE vendor by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Check if vendor has associated experiences
    const { data: experiences, error: experiencesError } = await supabaseAdmin
      .from('experiences')
      .select('id')
      .eq('vendor_id', id)
      .limit(1)

    if (experiencesError) {
      console.error('Error checking vendor experiences:', experiencesError)
      return NextResponse.json(
        { error: 'Failed to check vendor dependencies' },
        { status: 500 }
      )
    }

    if (experiences && experiences.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vendor with associated experiences. Please remove all experiences first.' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('vendors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting vendor:', error)
      return NextResponse.json(
        { error: 'Failed to delete vendor', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Vendor deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE vendor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 