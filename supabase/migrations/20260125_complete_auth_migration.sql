-- Migration: Complete Clerk to Supabase Auth Migration
-- This migration completes the transition from Clerk to Supabase Auth
-- by updating all user ID columns to use UUID and match auth.uid()

-- ============================================
-- IMPORTANT: CHOOSE YOUR MIGRATION STRATEGY
-- ============================================
-- Strategy A (Fresh Start): Uncomment the TRUNCATE lines below
-- Strategy B (Keep Data): Keep them commented and manually migrate data
-- See MIGRATION_STEPS.md for details

-- ============================================
-- STEP 1: Update USER table
-- Rename clerk_id to user_id and change to UUID
-- ============================================

-- Strategy A: Drop existing users (uncomment for fresh start)
TRUNCATE TABLE public.user CASCADE;

-- Add new user_id column as UUID
ALTER TABLE public.user ADD COLUMN IF NOT EXISTS user_id UUID;

-- Make user_id NOT NULL
ALTER TABLE public.user ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint
ALTER TABLE public.user ADD CONSTRAINT user_user_id_key UNIQUE (user_id);

-- Drop old clerk_id column
ALTER TABLE public.user DROP COLUMN IF EXISTS clerk_id;

-- ============================================
-- STEP 2: Update EXPENSE table
-- Rename user column to user_id and change to UUID
-- ============================================

-- Drop existing foreign key constraint
ALTER TABLE public.expense DROP CONSTRAINT IF EXISTS expense_user_fkey;

-- Strategy A: Drop existing expenses (uncomment for fresh start)
TRUNCATE TABLE public.expense;

-- Add new user_id column as UUID
ALTER TABLE public.expense ADD COLUMN IF NOT EXISTS user_id UUID;

-- Make user_id NOT NULL
ALTER TABLE public.expense ALTER COLUMN user_id SET NOT NULL;

-- Drop old user column
ALTER TABLE public.expense DROP COLUMN IF EXISTS "user";

-- Add foreign key constraint
ALTER TABLE public.expense 
ADD CONSTRAINT expense_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.user(user_id) 
ON DELETE CASCADE;

-- ============================================
-- STEP 3: Update RECORD table user_id to NOT NULL
-- (Already has user_id but it's nullable)
-- ============================================

-- Make sure all records have a user_id (clean up orphaned records)
DELETE FROM public.record WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE public.record ALTER COLUMN user_id SET NOT NULL;

-- Drop existing foreign key if exists
ALTER TABLE public.record DROP CONSTRAINT IF EXISTS record_user_id_fkey;

-- Add foreign key
ALTER TABLE public.record 
ADD CONSTRAINT record_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.user(user_id) 
ON DELETE CASCADE;

-- ============================================
-- STEP 4: Update RLS policies for EXPENSE table
-- Now that user_id is UUID, update policies
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expense;
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expense;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expense;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expense;

-- Create new policies with UUID comparison
CREATE POLICY "Users can insert their own expenses" ON public.expense
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own expenses" ON public.expense
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON public.expense
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON public.expense
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Add RLS policies for USER table
-- ============================================

ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user;

-- Users can only view and insert their own profile
CREATE POLICY "Users can view their own profile" ON public.user
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 6: Add indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_expense_user_id ON public.expense(user_id);
CREATE INDEX IF NOT EXISTS idx_record_user_id ON public.record(user_id);
CREATE INDEX IF NOT EXISTS idx_record_asset ON public.record(asset);
CREATE INDEX IF NOT EXISTS idx_record_currency ON public.record(currency);
CREATE INDEX IF NOT EXISTS idx_expense_currency ON public.expense(currency);
CREATE INDEX IF NOT EXISTS idx_user_user_id ON public.user(user_id);

-- ============================================
-- STEP 7: Update get_user_records function
-- Ensure it uses user_id correctly
-- ============================================

DROP FUNCTION IF EXISTS public.get_user_records(TEXT);

CREATE OR REPLACE FUNCTION public.get_user_records(p_user_id UUID)
RETURNS TABLE (
  id INTEGER,
  asset TEXT,
  currency TEXT,
  price NUMERIC,
  shares NUMERIC,
  user_id UUID,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id, asset, currency, price, shares, user_id, note, created_at
  FROM public.record
  WHERE record.user_id = p_user_id
  ORDER BY created_at DESC;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_records(UUID) TO authenticated;
