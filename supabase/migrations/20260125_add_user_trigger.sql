-- Migration: Add trigger to automatically create user record on sign up
-- This ensures a user record is created in the public.user table
-- whenever a new user signs up via Supabase Auth

-- ============================================
-- STEP 1: Create function to handle new user
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user (user_id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 2: Create trigger on auth.users table
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 3: Grant necessary permissions
-- ============================================

-- Allow the trigger function to insert into user table
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user TO postgres, anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE user_id_seq TO postgres, anon, authenticated, service_role;
