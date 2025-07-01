-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366f1', -- hex color for UI
  icon VARCHAR(50), -- icon name or emoji
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create occasions table
CREATE TABLE IF NOT EXISTS public.occasions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#ec4899', -- hex color for UI
  icon VARCHAR(50), -- icon name or emoji
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  is_seasonal BOOLEAN DEFAULT false,
  season_start DATE, -- when this occasion becomes relevant (e.g., Dec 1 for Christmas)
  season_end DATE,   -- when this occasion ends (e.g., Dec 25 for Christmas)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS categories_active_idx ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS categories_sort_idx ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS occasions_active_idx ON public.occasions(is_active);
CREATE INDEX IF NOT EXISTS occasions_sort_idx ON public.occasions(sort_order);
CREATE INDEX IF NOT EXISTS occasions_seasonal_idx ON public.occasions(is_seasonal);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (is_admin_from_auth());

-- Occasions policies  
CREATE POLICY "Anyone can view active occasions" ON public.occasions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage occasions" ON public.occasions
  FOR ALL USING (is_admin_from_auth());

-- Insert default categories
INSERT INTO public.categories (name, description, color, icon, sort_order) VALUES
('Wellness', 'Spa, relaxation, and health experiences', '#10b981', '🧘', 1),
('Food', 'Dining, culinary, and food-related experiences', '#f59e0b', '🍽️', 2),
('Adventure', 'Outdoor, sports, and thrilling activities', '#ef4444', '🏔️', 3),
('Technology', 'Gadgets, tech products, and digital experiences', '#3b82f6', '💻', 4),
('Arts', 'Creative, cultural, and artistic experiences', '#8b5cf6', '🎨', 5),
('Fashion', 'Style, beauty, and fashion-related items', '#ec4899', '👗', 6),
('Sports', 'Athletic activities and sports equipment', '#f97316', '⚽', 7),
('Education', 'Learning, courses, and skill development', '#06b6d4', '📚', 8),
('Entertainment', 'Movies, games, and leisure activities', '#84cc16', '🎬', 9),
('Travel', 'Trips, accommodations, and travel experiences', '#14b8a6', '✈️', 10);

-- Insert default occasions
INSERT INTO public.occasions (name, description, color, icon, sort_order, is_seasonal, season_start, season_end) VALUES
('Birthday', 'Birthday celebrations and gifts', '#ec4899', '🎂', 1, false, null, null),
('Anniversary', 'Wedding anniversaries and relationship milestones', '#f59e0b', '💕', 2, false, null, null),
('Graduation', 'Academic achievements and milestones', '#3b82f6', '🎓', 3, true, '2024-05-01', '2024-07-31'),
('Holiday', 'General holiday celebrations', '#ef4444', '🎁', 4, false, null, null),
('Thank You', 'Appreciation and gratitude gifts', '#10b981', '🙏', 5, false, null, null),
('Just Because', 'Spontaneous gifts without special occasion', '#8b5cf6', '💝', 6, false, null, null),
('Wedding', 'Wedding celebrations and gifts', '#f97316', '👰', 7, false, null, null),
('Valentine''s Day', 'Romantic gifts and celebrations', '#ec4899', '💖', 8, true, '2024-02-01', '2024-02-14'),
('Mother''s Day', 'Celebrating mothers', '#f59e0b', '👩', 9, true, '2024-05-01', '2024-05-15'),
('Father''s Day', 'Celebrating fathers', '#3b82f6', '👨', 10, true, '2024-06-01', '2024-06-20'),
('Christmas', 'Christmas celebration', '#ef4444', '🎄', 11, true, '2024-12-01', '2024-12-25'),
('New Year', 'New Year celebrations', '#8b5cf6', '🎉', 12, true, '2024-12-25', '2025-01-05');

-- Function to get active categories
CREATE OR REPLACE FUNCTION get_active_categories()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  color VARCHAR,
  icon VARCHAR,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.description, c.color, c.icon, c.sort_order
  FROM public.categories c
  WHERE c.is_active = true
  ORDER BY c.sort_order ASC, c.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active occasions (with seasonal filtering)
CREATE OR REPLACE FUNCTION get_active_occasions()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  color VARCHAR,
  icon VARCHAR,
  sort_order INTEGER,
  is_seasonal BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.name, o.description, o.color, o.icon, o.sort_order, o.is_seasonal
  FROM public.occasions o
  WHERE o.is_active = true
  AND (
    o.is_seasonal = false 
    OR (
      o.is_seasonal = true 
      AND CURRENT_DATE BETWEEN o.season_start AND o.season_end
    )
  )
  ORDER BY o.sort_order ASC, o.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_active_categories() TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_occasions() TO authenticated; 