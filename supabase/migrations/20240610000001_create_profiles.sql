-- Create the profiles table to store public-facing user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY NOT NULL, -- This will be the same as auth.users.id
  email text UNIQUE,
  name text,
  role text DEFAULT 'user',
  phone text,
  address text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Stores public user information and role.';

-- Create index for email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email); 