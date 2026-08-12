-- ========================================================
-- SETUP SUPABASE PUBLIC.ORDERS & PUBLIC.ORDER_ITEMS TABLES
-- ========================================================
-- Execute this entire script in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard -> SQL Editor -> New Query

-- 1. DROP CONFLICTING OLD TABLES IF THEY HAD UUID KEY MISMATCHES
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- 2. CREATE PUBLIC.ORDERS TABLE (id as TEXT for ORD-xxxxxx order numbers)
CREATE TABLE public.orders (
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

-- 3. CREATE PUBLIC.ORDER_ITEMS TABLE (order_id as TEXT)
CREATE TABLE public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT
);

-- 4. GRANT PERMISSIONS TO POSTGREST ROLES
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.order_items TO anon, authenticated, service_role;

-- 5. CONFIGURE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select on orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "Allow insert on orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on orders" ON public.orders
  FOR UPDATE USING (true);

CREATE POLICY "Allow select on order_items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow insert on order_items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- 6. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

-- 7. VERIFY TABLE CREATION
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name IN ('orders', 'order_items')
ORDER BY table_name, ordinal_position;
