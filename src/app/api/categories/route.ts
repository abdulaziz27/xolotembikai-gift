import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Fallback categories data if database is not ready
const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Wellness', description: 'Spa and relaxation', color: '#10b981', icon: '🧘', sort_order: 1 },
  { id: '2', name: 'Food', description: 'Dining experiences', color: '#f59e0b', icon: '🍽️', sort_order: 2 },
  { id: '3', name: 'Adventure', description: 'Outdoor activities', color: '#ef4444', icon: '🏔️', sort_order: 3 },
  { id: '4', name: 'Arts', description: 'Creative experiences', color: '#8b5cf6', icon: '🎨', sort_order: 4 },
  { id: '5', name: 'Entertainment', description: 'Fun activities', color: '#84cc16', icon: '🎬', sort_order: 5 }
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Strategy 1: Try direct table query with is_active column
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (!error && categories && categories.length > 0) {
        console.log('✅ Successfully fetched categories with is_active filter');
        return NextResponse.json(categories);
      }
    } catch (tableError) {
      console.log('❌ Failed to query categories with is_active:', tableError);
    }
    
    // Strategy 2: Try direct table query without is_active column
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (!error && categories && categories.length > 0) {
        console.log('✅ Successfully fetched categories without is_active filter');
        return NextResponse.json(categories);
      }
    } catch (basicTableError) {
      console.log('❌ Failed basic categories table query:', basicTableError);
    }
    
    // Strategy 3: Return fallback data
    console.log('⚠️ All database strategies failed, returning fallback categories data');
    return NextResponse.json(FALLBACK_CATEGORIES);

  } catch (error) {
    console.error('❌ Complete error in categories API:', error);
    // Even if everything fails, return fallback data to prevent UI crashes
    return NextResponse.json(FALLBACK_CATEGORIES);
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
    const { name, description, color, icon, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description,
        color: color || '#E91E63',
        icon: icon || '📁',
        status: status || 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      if (error.code === '23505') { // unique constraint violation
        return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error in POST categories API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 