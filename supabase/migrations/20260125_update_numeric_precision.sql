-- Migration: Update numeric precision for high-precision decimals
-- This migration ensures the database can store numbers with up to 16 decimal places
-- Required for cryptocurrencies with very small values (e.g., 0.00000000086)

-- ============================================
-- STEP 1: Update RECORD table price and shares columns
-- ============================================

-- Check current precision and update if needed
-- NUMERIC without precision specified already supports arbitrary precision in PostgreSQL
-- But we'll explicitly set it for clarity

-- Note: PostgreSQL NUMERIC can store numbers with up to 131,072 digits before the decimal point
-- and up to 16,383 digits after the decimal point. Our requirement of 16 decimals is well supported.

-- Update price column to explicitly support high precision
ALTER TABLE public.record 
ALTER COLUMN price TYPE NUMERIC(30, 16);

-- Update shares column to explicitly support high precision
ALTER TABLE public.record 
ALTER COLUMN shares TYPE NUMERIC(30, 16);

-- ============================================
-- STEP 2: Update EXPENSE table value column
-- ============================================

ALTER TABLE public.expense 
ALTER COLUMN value TYPE NUMERIC(30, 16);

-- ============================================
-- NOTES:
-- ============================================
-- NUMERIC(30, 16) means:
-- - Total of 30 digits
-- - 16 digits after the decimal point
-- - 14 digits before the decimal point
-- 
-- This supports values like:
-- - 0.0000000001234567 (16 decimals)
-- - 99999999999999.9999999999999999 (14 digits before, 16 after)
-- - Perfect for cryptocurrencies like SHIB, PEPE, etc.
-- 
-- PostgreSQL stores NUMERIC exactly (no floating point errors)
