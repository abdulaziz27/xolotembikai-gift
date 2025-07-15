CREATE TABLE IF NOT EXISTS public.vendors (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    website_url text,
    email text,
    phone text,
    address text,
    logo_url text,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    commission_rate numeric DEFAULT 0.100,
    is_active boolean DEFAULT true,
    contact_person text,
    api_integration_type character varying DEFAULT 'manual'::character varying,
    api_credentials jsonb
);
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.vendors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.vendors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.vendors FOR DELETE USING (auth.role() = 'authenticated'); 