import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Fallback vendors data if database is not ready
const FALLBACK_VENDORS = [
  { 
    id: '1', 
    name: 'Spa Retreat Center', 
    email: 'contact@sparetreAt.com',
    description: 'Luxury spa and wellness center',
    commission_rate: 0.15,
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Adventure Tours Co', 
    email: 'info@adventuretours.com',
    description: 'Outdoor adventure experiences',
    commission_rate: 0.12,
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Culinary Academy', 
    email: 'bookings@culinaryacademy.com',
    description: 'Cooking classes and food experiences',
    commission_rate: 0.10,
    status: 'active'
  }
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Strategy 1: Try direct table query with status filter
    try {
      const { data: vendors, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (!error && vendors && vendors.length > 0) {
        console.log('✅ Successfully fetched vendors with status filter');
        return NextResponse.json(vendors);
      }
    } catch (tableError) {
      console.log('❌ Failed to query vendors with status filter:', tableError);
    }
    
    // Strategy 2: Try direct table query without status filter
    try {
      const { data: vendors, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name', { ascending: true });

      if (!error && vendors && vendors.length > 0) {
        console.log('✅ Successfully fetched vendors without status filter');
        return NextResponse.json(vendors);
      }
    } catch (basicTableError) {
      console.log('❌ Failed basic vendors table query:', basicTableError);
    }
    
    // Strategy 3: Return fallback data
    console.log('⚠️ All database strategies failed, returning fallback vendors data');
    return NextResponse.json(FALLBACK_VENDORS);

  } catch (error) {
    console.error('❌ Complete error in vendors API:', error);
    // Even if everything fails, return fallback data to prevent UI crashes
    return NextResponse.json(FALLBACK_VENDORS);
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json();
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
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Vendor name and email are required' }, { status: 400 });
    }

    const { data: vendor, error } = await supabaseAdmin
      .from('vendors')
      .insert([{
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
        is_active: is_active !== undefined ? is_active : true
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating vendor:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Vendor with this name or email already exists' }, { status: 409 });
      }
      return NextResponse.json({ 
        error: 'Failed to create vendor',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error('❌ Error in POST vendors API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 