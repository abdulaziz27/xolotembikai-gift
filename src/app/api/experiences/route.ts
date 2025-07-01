import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin, isUserAdmin } from '@/lib/supabase/admin';
import { Experience, ExperienceForm, ExperienceListResponse } from '@/types/experiences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const occasions = searchParams.get('occasions')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'featured';
    const status = searchParams.get('status') || 'active';

    const supabase = await createClient();
    
    let query = supabase
      .from('experiences')
      .select(`
        *,
        vendor:vendors(*)
      `);

    // Only filter by status if specified
    if (status) {
      query = query.eq('status', status);
    }

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%, short_description.ilike.%${search}%, tags.cs.{${search}}`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (priceMin) {
      query = query.gte('starting_price', parseFloat(priceMin));
    }

    if (priceMax) {
      query = query.lte('starting_price', parseFloat(priceMax));
    }

    if (occasions.length > 0) {
      query = query.overlaps('occasions', occasions);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        query = query.order('starting_price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('starting_price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('total_bookings', { ascending: false });
        break;
      default: // featured
        query = query.order('is_featured', { ascending: false })
                    .order('rating', { ascending: false });
    }

    // Get total count with a separate query
    const countQuery = supabase
      .from('experiences')
      .select('*', { count: 'exact' });

    // Apply the same filters to count query
    if (status) {
      countQuery.eq('status', status);
    }
    if (search) {
      countQuery.or(`title.ilike.%${search}%, short_description.ilike.%${search}%, tags.cs.{${search}}`);
    }
    if (category) {
      countQuery.eq('category', category);
    }
    if (priceMin) {
      countQuery.gte('starting_price', parseFloat(priceMin));
    }
    if (priceMax) {
      countQuery.lte('starting_price', parseFloat(priceMax));
    }
    if (occasions.length > 0) {
      countQuery.overlaps('occasions', occasions);
    }

    // Get total count
    const { count } = await countQuery;

    // Apply pagination to main query
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: experiences, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching experiences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experiences' },
        { status: 500 }
      );
    }

    const response: ExperienceListResponse = {
      experiences: experiences as Experience[],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in experiences API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    // Check if user is admin using the proper admin client
    const isAdmin = await isUserAdmin(user.id);
    
    if (!isAdmin) {
      console.error('❌ User is not admin:', user.id);
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required'
      }, { status: 403 });
    }

    console.log('✅ Admin check passed for user:', user.id);

    const body: ExperienceForm = await request.json();

    // Generate slug if not provided
    let slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Ensure slug is unique
    try {
      const { data: existingSlug } = await supabase
        .from('experiences')
        .select('slug')
        .eq('slug', slug)
        .single();

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    } catch (slugError) {
      // If we can't check for existing slug, add timestamp anyway
      slug = `${slug}-${Date.now()}`;
    }

    // Map form fields to database columns - use any type to avoid schema cache issues
    const experienceData: any = {
      title: body.title,
      slug: slug,
      short_description: body.short_description,
      long_description: body.long_description,
      category: body.category,
      vendor_id: body.vendor_id,
      occasions: body.occasions,
      starting_price: body.starting_price,
      duration_hours: body.duration_hours,
      max_participants: body.max_participants,
      min_participants: body.min_participants,
      location: body.location,
      featured_image: body.featured_image,
      gallery: body.gallery,
      tags: body.tags,
      inclusions: body.inclusions,
      exclusions: body.exclusions,
      requirements: body.requirements,
      cancellation_policy: body.cancellation_policy,
      status: body.status,
      is_featured: body.is_featured,
      rating: 0,
      total_reviews: 0,
      total_bookings: 0
    };

    // Add optional fields only if they have values (to avoid schema cache issues)
    if (body.currency) {
      experienceData.currency = body.currency;
    }
    
    if (body.duration) {
      experienceData.duration = body.duration;
    }
    
    if (body.location) {
      experienceData.address = body.location; // Use location as address
    }
    
    if (body.long_description) {
      experienceData.description = body.long_description; // Duplicate for compatibility
    }
    
    if (body.starting_price) {
      experienceData.price = body.starting_price; // Duplicate for compatibility
    }
    
    if (body.redemption_instructions) {
      experienceData.redemption_instructions = body.redemption_instructions;
    }
    
    // Add boolean fields with defaults
    experienceData.allows_custom_message = body.allows_custom_message !== undefined ? body.allows_custom_message : true;
    experienceData.allows_scheduling = body.allows_scheduling !== undefined ? body.allows_scheduling : true;

    // Use admin client for creating experience to bypass RLS
    const { data: experience, error } = await supabaseAdmin
      .from('experiences')
      .insert([experienceData])
      .select(`
        *,
        vendor:vendors(*)
      `)
      .single();

    if (error) {
      console.error('❌ Error creating experience:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create experience',
          details: error.message,
          hint: error.hint 
        },
        { status: 500 }
      );
    }

    console.log('✅ Experience created successfully:', experience.id);
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('❌ Complete error in POST experiences API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 