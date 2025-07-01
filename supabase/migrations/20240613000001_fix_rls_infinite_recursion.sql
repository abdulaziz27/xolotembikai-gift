-- Fix infinite recursion in RLS policies

-- First, drop policies that depend on the problematic functions
DROP POLICY IF EXISTS "Only admins can insert admin data" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin data" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin data" ON admin_users;

-- Drop problematic policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Now we can safely drop functions that cause recursion
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS get_user_role();

-- Create a safe admin check function using auth.users table directly
CREATE OR REPLACE FUNCTION is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND (raw_user_meta_data ->> 'role') = 'admin'
  );
END;
$$;

-- Create new safe policies for profiles
CREATE POLICY "Admins can view all profiles (safe)" ON profiles
  FOR SELECT USING (
    -- Allow users to see their own profile
    auth.uid() = id 
    OR 
    -- Allow if user is admin (check from auth metadata)
    is_admin_from_auth()
  );

CREATE POLICY "Admins can update all profiles (safe)" ON profiles
  FOR UPDATE USING (
    -- Allow users to update their own profile
    auth.uid() = id 
    OR 
    -- Allow if user is admin (check from auth metadata)
    is_admin_from_auth()
  );

-- Allow admins to insert new profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin_from_auth());

-- Recreate admin_users policies with new function
CREATE POLICY "Only admins can insert admin data" ON admin_users
  FOR INSERT WITH CHECK (is_admin_from_auth());

CREATE POLICY "Admins can view all admin data" ON admin_users
  FOR SELECT USING (is_admin_from_auth());

CREATE POLICY "Admins can update admin data" ON admin_users
  FOR UPDATE USING (is_admin_from_auth());

-- Update the profile creation trigger to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create if profile doesn't already exist
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$; 