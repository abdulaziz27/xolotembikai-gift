import type { Vendor } from './vendors'

export interface Experience {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string; // Changed from full_description to match DB
  category: string;
  occasions: string[];
  starting_price: number;
  price_options: number[];
  currency: string;
  is_variable_pricing: boolean;
  vendor_id?: string;
  vendor?: Vendor;
  location?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  gallery: string[] | any; // Changed to handle JSONB type
  featured_image?: string;
  video_url?: string;
  duration?: string;
  duration_hours?: number; // Added to match sample data
  max_participants?: number;
  min_participants?: number; // Added to match sample data
  min_age?: number;
  difficulty_level?: 'Easy' | 'Moderate' | 'Challenging';
  redemption_instructions?: string;
  requirements: string[]; // Changed from booking_requirements
  inclusions: string[]; // Changed from included_items
  exclusions: string[]; // Changed from excluded_items
  cancellation_policy?: string;
  vendor_type: 'api' | 'manual';
  api_endpoint?: string;
  manual_codes: string[];
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  published_at?: string;
  expires_at?: string;
  is_featured: boolean;
  is_gift_wrappable: boolean;
  allows_custom_message: boolean;
  allows_scheduling: boolean;
  rating: number;
  total_reviews: number; // Added to match sample data
  total_bookings: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceReview {
  id: string;
  experience_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceForm {
  title: string;
  short_description: string;
  long_description: string; // Changed from full_description
  category: string;
  occasions: string[];
  starting_price: number;
  price_options: number[];
  currency: string;
  is_variable_pricing: boolean;
  vendor_id?: string;
  location?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  gallery: string[]; // Changed from images
  featured_image?: string;
  video_url?: string;
  duration?: string;
  duration_hours?: number; // Added
  max_participants?: number;
  min_participants?: number; // Added
  min_age?: number;
  difficulty_level?: 'Easy' | 'Moderate' | 'Challenging';
  redemption_instructions?: string;
  requirements: string[]; // Changed from booking_requirements
  inclusions: string[]; // Changed from included_items
  exclusions: string[]; // Changed from excluded_items
  cancellation_policy?: string;
  vendor_type: 'api' | 'manual';
  api_endpoint?: string;
  manual_codes: string[];
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  published_at?: string;
  expires_at?: string;
  is_featured: boolean;
  is_gift_wrappable: boolean;
  allows_custom_message: boolean;
  allows_scheduling: boolean;
}

export interface ExperienceFilters {
  priceRange: string[];
  occasion: string[];
  perfectFor: string[];
  interests: string[];
  giftType: string[];
  category?: string;
  location?: string;
  search?: string;
}

export interface ExperienceListResponse {
  experiences: Experience[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FilterOptions {
  priceRanges: Array<{
    label: string;
    count: number;
    min?: number;
    max?: number;
  }>;
  occasions: Array<{
    label: string;
    count: number;
  }>;
  perfectFor: Array<{
    label: string;
    count: number;
  }>;
  interests: Array<{
    label: string;
    count: number;
  }>;
  giftTypes: Array<{
    label: string;
    count: number;
  }>;
  categories: Array<{
    label: string;
    count: number;
  }>;
  locations: Array<{
    label: string;
    count: number;
  }>;
}

// Dynamic category and occasion interfaces
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  sort_order: number;
}

export interface Occasion {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  sort_order: number;
  is_seasonal: boolean;
}

export const CATEGORIES = [
  'Wellness',
  'Food',
  'Adventure',
  'Technology',
  'Arts',
  'Fashion',
  'Sports',
  'Education',
  'Entertainment',
  'Travel'
] as const;

export const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Graduation',
  'Holiday',
  'Thank You',
  'Just Because',
  'Wedding',
  'Valentine\'s Day',
  'Mother\'s Day',
  'Father\'s Day'
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' }
] as const;

export const DIFFICULTY_LEVELS = [
  'Easy',
  'Moderate',
  'Challenging'
] as const; 