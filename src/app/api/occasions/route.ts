import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Fallback occasions data if database is not ready
const FALLBACK_OCCASIONS = [
  { id: '1', name: 'Birthday', description: 'Birthday celebrations', color: '#ec4899', icon: '🎂', sort_order: 1, is_seasonal: false },
  { id: '2', name: 'Anniversary', description: 'Anniversary celebrations', color: '#f59e0b', icon: '💕', sort_order: 2, is_seasonal: false },
  { id: '3', name: 'Holiday', description: 'Holiday celebrations', color: '#ef4444', icon: '🎁', sort_order: 3, is_seasonal: false },
  { id: '4', name: 'Thank You', description: 'Appreciation gifts', color: '#10b981', icon: '🙏', sort_order: 4, is_seasonal: false },
  { id: '5', name: 'Just Because', description: 'Spontaneous gifts', color: '#8b5cf6', icon: '💝', sort_order: 5, is_seasonal: false }
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Multiple fallback strategies
    let occasions, error;
    
    // Strategy 1: Try using the database function
    try {
      const result = await supabase.rpc('get_active_occasions');
      occasions = result.data;
      error = result.error;
      
      if (!error && occasions && occasions.length > 0) {
        console.log('✅ Successfully fetched occasions using function');
        return NextResponse.json(occasions);
      }
    } catch (functionError) {
      console.log('❌ Function get_active_occasions not available:', functionError);
    }
    
    // Strategy 2: Try direct table query with is_active column
    try {
      const result = await supabase
        .from('occasions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      occasions = result.data;
      error = result.error;
      
      if (!error && occasions && occasions.length > 0) {
        console.log('✅ Successfully fetched occasions with is_active filter');
        return NextResponse.json(occasions);
      }
    } catch (tableError) {
      console.log('❌ Failed to query occasions with is_active:', tableError);
    }
    
    // Strategy 3: Try direct table query without is_active column
    try {
      const result = await supabase
        .from('occasions')
        .select('*')
        .order('sort_order', { ascending: true });
      
      occasions = result.data;
      error = result.error;
      
      if (!error && occasions && occasions.length > 0) {
        console.log('✅ Successfully fetched occasions without is_active filter');
        return NextResponse.json(occasions);
      }
    } catch (basicTableError) {
      console.log('❌ Failed basic occasions table query:', basicTableError);
    }
    
    // Strategy 4: Check if table exists at all
    try {
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'occasions')
        .single();
      
      if (!tableExists) {
        console.log('❌ Occasions table does not exist, using fallback data');
        return NextResponse.json(FALLBACK_OCCASIONS);
      }
    } catch (schemaError) {
      console.log('❌ Could not check table existence:', schemaError);
    }
    
    // Strategy 5: Return fallback data
    console.log('⚠️ All database strategies failed, returning fallback occasions data');
    return NextResponse.json(FALLBACK_OCCASIONS);

  } catch (error) {
    console.error('❌ Complete error in occasions API:', error);
    // Even if everything fails, return fallback data to prevent UI crashes
    return NextResponse.json(FALLBACK_OCCASIONS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || profile?.role !== 'admin') {
      console.error('Admin check failed:', profileError || `User role: ${profile?.role}`);
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, color, icon, sort_order, is_seasonal, season_start, season_end } = body;

    if (!name) {
      return NextResponse.json({ error: 'Occasion name is required' }, { status: 400 });
    }

    const { data: occasion, error } = await supabase
      .from('occasions')
      .insert([{
        name,
        description,
        color: color || '#ec4899',
        icon: icon || '🎁',
        sort_order: sort_order || 0,
        is_seasonal: is_seasonal || false,
        season_start: is_seasonal ? season_start : null,
        season_end: is_seasonal ? season_end : null,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating occasion:', error);
      if (error.code === '23505') { // unique constraint violation
        return NextResponse.json({ error: 'Occasion name already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create occasion' }, { status: 500 });
    }

    return NextResponse.json(occasion, { status: 201 });
  } catch (error) {
    console.error('Error in POST occasions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 