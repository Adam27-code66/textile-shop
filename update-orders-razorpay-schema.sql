-- ========================================================
-- ADD RAZORPAY PAYMENT TRACKING COLUMNS TO ORDERS TABLE
-- ========================================================
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Add Razorpay payment tracking columns if they don't already exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed'));

-- 2. Ensure RLS policies allow customer to view their own orders & Admin full management
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow customer to view own orders" ON public.orders;
CREATE POLICY "Allow customer to view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;
CREATE POLICY "Allow public order creation" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order updates" ON public.orders;
CREATE POLICY "Allow order updates" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Verify structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders';
