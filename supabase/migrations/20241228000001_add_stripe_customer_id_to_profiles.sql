-- Add a new column to the profiles table to store the Stripe Customer ID.
-- This is crucial for linking a Supabase user to a Stripe customer,
-- enabling us to find the correct user profile during webhook processing.
ALTER TABLE public.profiles
ADD COLUMN stripe_customer_id TEXT UNIQUE;

-- Add a comment to describe the purpose of the new column.
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stores the unique identifier for a customer in Stripe.';

-- Create an index on the new column for faster lookups.
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id); 