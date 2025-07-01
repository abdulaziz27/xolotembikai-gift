import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FilterOptions } from '@/types/experiences';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all active experiences for filter calculations
    const { data: experiences } = await supabase
      .from('experiences')
      .select('starting_price, occasions, category, location, vendor_type')
      .eq('status', 'active');

    // Get dynamic categories and occasions
    const [categoriesResult, occasionsResult] = await Promise.all([
      supabase.rpc('get_active_categories'),
      supabase.rpc('get_active_occasions')
    ]);

    if (!experiences) {
      return NextResponse.json({
        priceRanges: [],
        occasions: [],
        perfectFor: [],
        interests: [],
        giftTypes: [],
        categories: [],
        locations: []
      } as FilterOptions);
    }

    // Calculate price ranges
    const priceRanges = [
      { 
        label: 'Under $100', 
        count: experiences.filter(e => e.starting_price < 100).length,
        min: 0,
        max: 99
      },
      { 
        label: '$100 - $200', 
        count: experiences.filter(e => e.starting_price >= 100 && e.starting_price <= 200).length,
        min: 100,
        max: 200
      },
      { 
        label: '$200 - $300', 
        count: experiences.filter(e => e.starting_price > 200 && e.starting_price <= 300).length,
        min: 200,
        max: 300
      },
      { 
        label: '$300 - $400', 
        count: experiences.filter(e => e.starting_price > 300 && e.starting_price <= 400).length,
        min: 300,
        max: 400
      },
      { 
        label: '$500+', 
        count: experiences.filter(e => e.starting_price >= 500).length,
        min: 500
      }
    ];

    // Calculate occasions using dynamic data
    const occasionCounts: Record<string, number> = {};
    experiences.forEach(exp => {
      exp.occasions?.forEach((occasion: string) => {
        occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
      });
    });

    const dynamicOccasions = occasionsResult.data || [];
    const occasions = dynamicOccasions.map((occasion: any) => ({
      label: occasion.name,
      count: occasionCounts[occasion.name] || 0
    }));

    // Calculate categories (map to interests)
    const categoryToInterest: Record<string, string> = {
      'Food': 'Food & Dining',
      'Wellness': 'Wellness & Spa',
      'Adventure': 'Adventure & Sports',
      'Arts': 'Arts & Culture',
      'Technology': 'Tech & Gaming',
      'Fashion': 'Fashion & Beauty',
      'Sports': 'Adventure & Sports',
      'Education': 'Arts & Culture',
      'Entertainment': 'Arts & Culture',
      'Travel': 'Adventure & Sports'
    };

    const interestCounts: Record<string, number> = {};
    experiences.forEach(exp => {
      const interest = categoryToInterest[exp.category] || exp.category;
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });

    const interests = [
      { label: 'Food & Dining', count: interestCounts['Food & Dining'] || 0 },
      { label: 'Wellness & Spa', count: interestCounts['Wellness & Spa'] || 0 },
      { label: 'Adventure & Sports', count: interestCounts['Adventure & Sports'] || 0 },
      { label: 'Arts & Culture', count: interestCounts['Arts & Culture'] || 0 },
      { label: 'Tech & Gaming', count: interestCounts['Tech & Gaming'] || 0 },
      { label: 'Fashion & Beauty', count: interestCounts['Fashion & Beauty'] || 0 },
    ];

    // Perfect For (demographic mapping)
    const perfectFor = [
      { label: 'For Her', count: Math.floor(experiences.length * 0.4) }, // Mock calculation
      { label: 'For Him', count: Math.floor(experiences.length * 0.35) },
      { label: 'For Kids', count: Math.floor(experiences.length * 0.2) },
      { label: 'For Teens', count: Math.floor(experiences.length * 0.15) },
      { label: 'For Couples', count: Math.floor(experiences.length * 0.1) },
    ];

    // Gift Types
    const giftCardCount = experiences.filter(e => 
      e.vendor_type === 'manual' || 
      ['Food', 'Fashion', 'Technology'].includes(e.category)
    ).length;

    const giftTypes = [
      { label: 'General Gift Card', count: giftCardCount },
      { label: 'Custom Experience', count: experiences.length - giftCardCount },
    ];

    // Categories using dynamic data
    const categoryCounts: Record<string, number> = {};
    experiences.forEach(exp => {
      categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
    });

    const dynamicCategories = categoriesResult.data || [];
    const categories = dynamicCategories.map((category: any) => ({
      label: category.name,
      count: categoryCounts[category.name] || 0
    }));

    // Locations
    const locationCounts: Record<string, number> = {};
    experiences.forEach(exp => {
      if (exp.location) {
        locationCounts[exp.location] = (locationCounts[exp.location] || 0) + 1;
      }
    });

    const locations = Object.entries(locationCounts).map(([label, count]) => ({
      label,
      count
    }));

    const filterOptions: FilterOptions = {
      priceRanges,
      occasions,
      perfectFor,
      interests,
      giftTypes,
      categories,
      locations
    };

    return NextResponse.json(filterOptions);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 