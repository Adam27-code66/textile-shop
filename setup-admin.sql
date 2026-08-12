-- ========================================================
-- SETUP EXCLUSIVE ADMIN ACCESS FOR adamsamr1127@gmail.com
-- ========================================================
-- Instructions:
-- 1. Open Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your project: ysvhiisbwsfhlpowczsn
-- 3. Click "SQL Editor" on the left menu -> "New Query"
-- 4. Paste and Run this script.

-- 1. Ensure profiles table has proper columns and constraints
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'CUSTOMER')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Upsert adamsamr1127@gmail.com with ADMIN role if account exists in auth.users
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Shop Admin'), 
  'ADMIN'
FROM auth.users
WHERE LOWER(email) = 'adamsamr1127@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'ADMIN';

-- 3. Set default RLS policy so all other users are CUSTOMER by default
CREATE POLICY "Allow public select on profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow profiles update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 4. Verify admin user role in database
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE LOWER(email) = 'adamsamr1127@gmail.com';
