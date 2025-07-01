-- Create table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create index for email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email); 