-- ============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================

-- 1. Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Drop ALL existing restrictive RLS policies on products
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'products' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.products', pol.policyname);
  END LOOP;
END
$$;

-- 3. Create a single permissive policy allowing all operations
-- (Admin authorization is enforced in the API route code, not at the DB level)
CREATE POLICY "Allow all operations on products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Verify: Check the table columns
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;
