-- Create vendors table first (referenced by experiences)
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  api_integration_type VARCHAR(20) DEFAULT 'manual' CHECK (api_integration_type IN ('manual', 'api')),
  api_credentials JSONB,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(150) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  short_description VARCHAR(200) NOT NULL,
  long_description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  occasions TEXT[] DEFAULT '{}',
  starting_price DECIMAL(10,2) NOT NULL,
  price_options JSONB DEFAULT '{}',
  currency VARCHAR(3) DEFAULT 'MYR',
  is_variable_pricing BOOLEAN DEFAULT false,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  location VARCHAR(100),
  address TEXT,
  coordinates JSONB,
  gallery TEXT[] DEFAULT '{}',
  featured_image TEXT,
  video_url TEXT,
  duration VARCHAR(50),
  duration_hours INTEGER,
  max_participants INTEGER,
  min_participants INTEGER DEFAULT 1,
  min_age INTEGER,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Easy', 'Moderate', 'Challenging')),
  redemption_instructions TEXT,
  requirements TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  cancellation_policy TEXT,
  vendor_type VARCHAR(10) DEFAULT 'manual' CHECK (vendor_type IN ('api', 'manual')),
  api_endpoint TEXT,
  manual_codes TEXT[] DEFAULT '{}',
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  is_gift_wrappable BOOLEAN DEFAULT true,
  allows_custom_message BOOLEAN DEFAULT true,
  allows_scheduling BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create experience reviews table
CREATE TABLE IF NOT EXISTS public.experience_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS experiences_status_idx ON public.experiences(status);
CREATE INDEX IF NOT EXISTS experiences_category_idx ON public.experiences(category);
CREATE INDEX IF NOT EXISTS experiences_featured_idx ON public.experiences(is_featured);
CREATE INDEX IF NOT EXISTS experiences_vendor_idx ON public.experiences(vendor_id);
CREATE INDEX IF NOT EXISTS experiences_slug_idx ON public.experiences(slug);
CREATE INDEX IF NOT EXISTS vendors_status_idx ON public.vendors(status);
CREATE INDEX IF NOT EXISTS experience_reviews_experience_idx ON public.experience_reviews(experience_id);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_reviews ENABLE ROW LEVEL SECURITY;

-- Vendors policies
CREATE POLICY "Anyone can view active vendors" ON public.vendors
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage vendors" ON public.vendors
  FOR ALL USING (is_admin_from_auth());

-- Experiences policies
CREATE POLICY "Anyone can view active experiences" ON public.experiences
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage experiences" ON public.experiences
  FOR ALL USING (is_admin_from_auth());

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.experience_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.experience_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.experience_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON public.experience_reviews
  FOR ALL USING (is_admin_from_auth());

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_experience_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g')) 
         || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_experience_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_experience_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER experiences_slug_trigger
  BEFORE INSERT ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION set_experience_slug();

-- Function to update experience rating
CREATE OR REPLACE FUNCTION update_experience_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.experiences 
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.experience_reviews 
    WHERE experience_id = NEW.experience_id
  )
  WHERE id = NEW.experience_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_experience_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.experience_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_experience_rating();

-- Insert some sample vendors
INSERT INTO public.vendors (name, email, description, status) VALUES
('Serenity Wellness', 'contact@serenitywellness.com', 'Premium spa and wellness center', 'active'),
('Culinary Delights', 'info@culinarydelights.com', 'Fine dining experiences', 'active'),
('Thrill Seekers', 'hello@thrillseekers.com', 'Adventure and sports activities', 'active'),
('Digital World', 'support@digitalworld.com', 'Technology and gadgets store', 'active'),
('Creative Spaces', 'contact@creativespaces.com', 'Art and culture experiences', 'active'),
('Style Central', 'info@stylecentral.com', 'Fashion and style boutique', 'active');

-- Insert some sample experiences
INSERT INTO public.experiences (
  title, short_description, long_description, category, occasions, starting_price, 
  currency, vendor_id, location, featured_image, duration, difficulty_level, 
  status, is_featured, inclusions, rating, total_bookings
) VALUES
(
  'Spa Day Experience Package',
  'Luxurious spa day with massage, facial and wellness treatments',
  'Indulge in a full day of relaxation and rejuvenation. This premium experience includes access to all spa facilities, a 90-minute signature massage, facial treatment, and a healthy gourmet lunch.',
  'Wellness',
  ARRAY['Birthday', 'Anniversary', 'Thank You'],
  150.00,
  'USD',
  (SELECT id FROM public.vendors WHERE name = 'Serenity Wellness'),
  'Downtown',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
  '6 hours',
  'Easy',
  'active',
  true,
  ARRAY['90-minute massage', 'Facial treatment', 'Spa facilities access', 'Healthy lunch'],
  4.9,
  234
),
(
  'Fine Dining Restaurant Card',
  'Gift card for premium dining experiences',
  'Give the gift of exceptional cuisine. This gift card can be used at any of our partner restaurants for an unforgettable dining experience.',
  'Food',
  ARRAY['Birthday', 'Anniversary', 'Holiday'],
  100.00,
  'USD',
  (SELECT id FROM public.vendors WHERE name = 'Culinary Delights'),
  'City Center',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
  'Flexible',
  'Easy',
  'active',
  false,
  ARRAY['3-course meal', 'Wine pairing', 'Premium service'],
  4.8,
  189
),
(
  'Adventure Sports Package',
  'Thrilling outdoor adventure activities',
  'Perfect for adrenaline junkies! This package includes multiple adventure activities like zip-lining, rock climbing, and white-water rafting.',
  'Adventure',
  ARRAY['Birthday', 'Graduation'],
  250.00,
  'USD',
  (SELECT id FROM public.vendors WHERE name = 'Thrill Seekers'),
  'Mountain Resort',
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
  '8 hours',
  'Challenging',
  'active',
  false,
  ARRAY['All equipment', 'Professional guide', 'Safety briefing', 'Lunch'],
  4.7,
  156
),
(
  'Tech Store Gift Card',
  'Latest gadgets and technology products',
  'Perfect for tech enthusiasts. This gift card provides access to the latest smartphones, laptops, gaming gear, and innovative gadgets.',
  'Technology',
  ARRAY['Birthday', 'Holiday', 'Graduation'],
  75.00,
  'USD',
  (SELECT id FROM public.vendors WHERE name = 'Digital World'),
  'Tech Mall',
  'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
  'Flexible',
  'Easy',
  'active',
  true,
  ARRAY['Latest products', 'Warranty coverage', 'Expert advice'],
  4.9,
  312
),
(
  'Art & Culture Experience',
  'Immersive art workshops and cultural activities',
  'Explore your creative side with guided art workshops, museum tours, and cultural experiences led by professional artists.',
  'Arts',
  ARRAY['Birthday', 'Thank You', 'Just Because'],
  125.00,
  'USD',
  (SELECT id FROM public.vendors WHERE name = 'Creative Spaces'),
  'Arts District',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
  '4 hours',
  'Moderate',
  'active',
  false,
  ARRAY['Art supplies', 'Professional instruction', 'Gallery tour', 'Refreshments'],
  4.6,
  98
),
(
  'Fashion Boutique Card',
  'Premium fashion and style accessories',
  'Discover the latest fashion trends with this boutique gift card. Perfect for fashion lovers who appreciate quality and style.',
  'Fashion',
  ARRAY['Birthday', 'Anniversary', 'Holiday'],
  200.00,
  'USD',
  (SELECT id FROM public.vendors WHERE name = 'Style Central'),
  'Shopping District',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
  'Flexible',
  'Easy',
  'active',
  false,
  ARRAY['Personal styling', 'Premium brands', 'Flexible exchange'],
  4.5,
  267
); 