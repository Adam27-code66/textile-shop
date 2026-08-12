-- ========================================================
-- SETUP SUPABASE PUBLIC.ORDERS & PUBLIC.ORDER_ITEMS TABLES
-- ========================================================
-- Execute this entire script in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard -> SQL Editor -> New Query

-- 1. CREATE PUBLIC.ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist if table was previously created with partial schema
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. CREATE PUBLIC.ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT
);

-- 3. GRANT PERMISSIONS TO POSTGREST ROLES
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.order_items TO anon, authenticated, service_role;

-- 4. CONFIGURE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop previous policies if they exist to avoid duplication
DROP POLICY IF EXISTS "Allow select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow select on order_items" ON public.order_items;

-- Select Policy: Customers can view their own orders or Admin full access
CREATE POLICY "Allow select on orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Insert Policy: Allow order creation from checkout API
CREATE POLICY "Allow insert on orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Update Policy: Allow status updates from webhook & admin dashboard
CREATE POLICY "Allow update on orders" ON public.orders
  FOR UPDATE USING (true);

-- Order Items Policies
CREATE POLICY "Allow select on order_items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow insert on order_items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- 5. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

-- 6. VERIFY TABLE CREATION
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name IN ('orders', 'order_items')
ORDER BY table_name, ordinal_position;
