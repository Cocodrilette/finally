-- Migration: Add Row Level Security (RLS) policies
-- This migration adds proper RLS policies so users can only access their own data

-- ============================================
-- STEP 1: Enable RLS on all tables
-- ============================================

ALTER TABLE public.record ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Drop existing permissive policies
-- ============================================

-- Record table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.record;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.record;
DROP POLICY IF EXISTS "Users can insert their own records" ON public.record;
DROP POLICY IF EXISTS "Users can view their own records" ON public.record;
DROP POLICY IF EXISTS "Users can update their own records" ON public.record;
DROP POLICY IF EXISTS "Users can delete their own records" ON public.record;

-- Expense table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.expense;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.expense;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expense;
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expense;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expense;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expense;

-- Asset table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.asset;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.asset;
DROP POLICY IF EXISTS "Authenticated users can read assets" ON public.asset;
DROP POLICY IF EXISTS "Authenticated users can insert assets" ON public.asset;

-- Currency table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.currency;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.currency;
DROP POLICY IF EXISTS "Authenticated users can read currencies" ON public.currency;
DROP POLICY IF EXISTS "Authenticated users can insert currencies" ON public.currency;

-- ============================================
-- STEP 3: Create RLS policies for RECORD table
-- Users can only access their own records
-- ============================================

CREATE POLICY "Users can insert their own records" ON public.record
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own records" ON public.record
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" ON public.record
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" ON public.record
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: Create RLS policies for EXPENSE table
-- Note: expense.user is TEXT, so we cast auth.uid() to TEXT
-- After migration to user_id (UUID), update these policies
-- ============================================

CREATE POLICY "Users can insert their own expenses" ON public.expense
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = "user");

CREATE POLICY "Users can view their own expenses" ON public.expense
FOR SELECT TO authenticated
USING (auth.uid()::text = "user");

CREATE POLICY "Users can update their own expenses" ON public.expense
FOR UPDATE TO authenticated
USING (auth.uid()::text = "user")
WITH CHECK (auth.uid()::text = "user");

CREATE POLICY "Users can delete their own expenses" ON public.expense
FOR DELETE TO authenticated
USING (auth.uid()::text = "user");

-- ============================================
-- STEP 5: Create RLS policies for ASSET table
-- Assets are shared resources (lookup table)
-- All authenticated users can read, only insert new ones
-- ============================================

CREATE POLICY "Authenticated users can read assets" ON public.asset
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert assets" ON public.asset
FOR INSERT TO authenticated
WITH CHECK (true);

-- No update/delete policies - assets should be immutable once created

-- ============================================
-- STEP 6: Create RLS policies for CURRENCY table
-- Currencies are shared resources (lookup table)
-- All authenticated users can read, only insert new ones
-- ============================================

CREATE POLICY "Authenticated users can read currencies" ON public.currency
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert currencies" ON public.currency
FOR INSERT TO authenticated
WITH CHECK (true);

-- No update/delete policies - currencies should be immutable once created
