-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'vendor');

-- Add role and updated_at to profiles, and set up a trigger for updated_at
ALTER TABLE profiles
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Note: The 'role' column is already added in the initial create_profiles script.
-- This file previously tried to add it again, causing a conflict.
-- The following lines have been removed to fix the migration failure:
--
-- ALTER TABLE profiles
--   ADD COLUMN role user_role DEFAULT 'user',
--   ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create admin users table for additional admin-specific data
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Basic policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin users policies (will be enhanced by later migrations)
CREATE POLICY "Admin users can view their own data" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Update existing profiles to have default user role if null
UPDATE profiles SET role = 'user' WHERE role IS NULL; 