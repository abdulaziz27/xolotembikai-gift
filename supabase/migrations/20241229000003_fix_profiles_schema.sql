-- Ensure profiles table has all required fields for webhook integration
-- This migration adds missing columns if they don't exist

-- Add stripe_customer_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE public.profiles ADD COLUMN stripe_customer_id TEXT UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
    END IF;
END $$;

-- Ensure 'name' column exists (some migrations use 'name', others use 'full_name')
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
END $$;

-- Ensure 'full_name' column exists for compatibility
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- Update existing records to sync name and full_name if one is missing
UPDATE public.profiles 
SET name = full_name 
WHERE name IS NULL AND full_name IS NOT NULL;

UPDATE public.profiles 
SET full_name = name 
WHERE full_name IS NULL AND name IS NOT NULL; 