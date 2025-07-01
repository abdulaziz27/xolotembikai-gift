-- Fix vendors table schema - add missing api_credentials column
-- Run this in Supabase Dashboard > SQL Editor

-- Add api_credentials column if it doesn't exist
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS api_credentials JSONB;

-- Add comment for documentation
COMMENT ON COLUMN public.vendors.api_credentials IS 'Stores API credentials for vendors with api integration type';

-- Create index for better performance on JSONB queries
CREATE INDEX IF NOT EXISTS idx_vendors_api_credentials_gin 
ON public.vendors USING gin (api_credentials);

-- Update existing vendors with api integration type to have empty credentials
UPDATE public.vendors 
SET api_credentials = '{}'::jsonb 
WHERE api_integration_type = 'api' AND api_credentials IS NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'vendors' 
AND column_name = 'api_credentials'; 