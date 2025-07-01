-- Create function to create admin users
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT,
  full_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  encrypted_pw TEXT;
BEGIN
  -- Generate user ID
  user_id := gen_random_uuid();
  
  -- Encrypt password (simplified for demo)
  encrypted_pw := crypt(user_password, gen_salt('bf'));
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    json_build_object(
      'full_name', COALESCE(full_name, user_email),
      'role', 'admin'
    ),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Insert into profiles
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    user_id,
    user_email,
    COALESCE(full_name, user_email),
    'admin'
  );

  RETURN json_build_object(
    'success', true,
    'user_id', user_id,
    'email', user_email
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Create function to create regular users
CREATE OR REPLACE FUNCTION create_regular_user(
  user_email TEXT,
  user_password TEXT,
  full_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  encrypted_pw TEXT;
BEGIN
  -- Generate user ID
  user_id := gen_random_uuid();
  
  -- Encrypt password
  encrypted_pw := crypt(user_password, gen_salt('bf'));
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    json_build_object(
      'full_name', COALESCE(full_name, user_email),
      'role', 'user'
    ),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Insert into profiles
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    user_id,
    user_email,
    COALESCE(full_name, user_email),
    'user'
  );

  RETURN json_build_object(
    'success', true,
    'user_id', user_id,
    'email', user_email
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$; 