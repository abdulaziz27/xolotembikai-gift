CREATE TABLE IF NOT EXISTS public.experiences (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    slug text NOT NULL,
    short_description text,
    long_description text,
    featured_image text,
    gallery jsonb DEFAULT '[]'::jsonb,
    starting_price numeric NOT NULL,
    category text NOT NULL,
    vendor_id uuid,
    occasions text[] DEFAULT '{}'::text[],
    duration_hours integer,
    max_participants integer,
    min_participants integer DEFAULT 1,
    location text,
    tags text[] DEFAULT '{}'::text[],
    inclusions text[] DEFAULT '{}'::text[],
    exclusions text[] DEFAULT '{}'::text[],
    requirements text[] DEFAULT '{}'::text[],
    cancellation_policy text,
    status text DEFAULT 'draft'::text,
    is_featured boolean DEFAULT false,
    rating numeric DEFAULT 0,
    total_reviews integer DEFAULT 0,
    total_bookings integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    currency character varying DEFAULT 'MYR'::character varying,
    address text,
    full_description text,
    allows_custom_message boolean DEFAULT true,
    what_to_bring text[] DEFAULT '{}'::text[],
    important_notes text,
    meeting_point text,
    price numeric,
    duration text,
    description text,
    category_id uuid,
    occasion_id uuid,
    allows_scheduling boolean DEFAULT true,
    redemption_instructions text
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.experiences FOR DELETE USING (auth.role() = 'authenticated');

-- Indices for performance
CREATE UNIQUE INDEX IF NOT EXISTS experiences_slug_idx ON public.experiences (slug);
CREATE INDEX IF NOT EXISTS experiences_category_idx ON public.experiences (category);
CREATE INDEX IF NOT EXISTS experiences_vendor_id_idx ON public.experiences (vendor_id); 