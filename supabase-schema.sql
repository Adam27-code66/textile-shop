-- ========================================================
-- AREA 51 TEXTILE SHOP DATABASE SCHEMA & SECURITY POLICIES
-- ========================================================

-- 1. PROFILES TABLE (Role-Based Authentication)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'CUSTOMER')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow admin full access to profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );


-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  material TEXT,
  care_instructions TEXT,
  stock_status TEXT DEFAULT 'In Stock' CHECK (stock_status IN ('In Stock', 'Out of Stock', 'Low Stock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public access and backend API route mutations for products
CREATE POLICY "Allow public read and API mutations for products" ON public.products
  FOR ALL USING (true);


-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Insert Default Categories
INSERT INTO public.categories (id, name, slug, description)
VALUES
  ('t-shirts', 'T-Shirts', 't-shirts', 'Heavyweight oversised and classic tees'),
  ('shirts', 'Shirts', 'shirts', 'Smart casual and formal cotton shirts'),
  ('hoodies', 'Hoodies', 'hoodies', 'Cozy fleece and streetwear hoodies'),
  ('pants', 'Pants', 'pants', 'Trousers, denim jeans, and cargo pants'),
  ('jackets', 'Jackets', 'jackets', 'Outerwear and denim jackets'),
  ('dresses', 'Dresses', 'dresses', 'Casual and formal apparel'),
  ('sarees', 'Sarees', 'sarees', 'Traditional silk and cotton sarees'),
  ('kids-wear', 'Kids Wear', 'kids-wear', 'Apparel for children'),
  ('accessories', 'Accessories', 'accessories', 'Hats, bags, and apparel accents')
ON CONFLICT (id) DO NOTHING;

-- 4. ORDERS & ORDER ITEMS TABLES
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT,
  color TEXT
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow customer to view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Allow public order creation" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public order items creation" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 5. SAMPLE PRODUCTS SEED DATA
INSERT INTO public.products (id, name, price, description, category, colors, sizes, images, badge, is_featured, is_new_arrival, material, care_instructions, stock_status)
VALUES
  (
    'archive-oversized-tee',
    'Archive Oversized Tee',
    1299,
    'A staple piece from the Archive collection. This oversized tee features a relaxed drop-shoulder silhouette crafted from premium 240 GSM cotton.',
    'T-Shirts',
    '[{"name": "Obsidian Black", "hex": "#1a1a1a"}, {"name": "Phantom Grey", "hex": "#4a4a4a"}, {"name": "Archive White", "hex": "#f0f0f0"}]'::jsonb,
    '["S", "M", "L", "XL"]'::jsonb,
    '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"]'::jsonb,
    'Bestseller',
    true,
    false,
    '100% Premium Cotton, 240 GSM',
    'Machine wash cold. Tumble dry low.',
    'In Stock'
  ),
  (
    'signature-graphic-tee',
    'Signature Graphic Tee',
    1499,
    'Express your identity with our Signature Graphic Tee. Features an exclusive AREA 51 print on heavyweight cotton.',
    'T-Shirts',
    '[{"name": "Deep Black", "hex": "#0d0d0d"}, {"name": "Washed Charcoal", "hex": "#3d3d3d"}]'::jsonb,
    '["S", "M", "L", "XL"]'::jsonb,
    '["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"]'::jsonb,
    NULL,
    true,
    true,
    '100% Cotton, 220 GSM',
    'Machine wash cold inside out.',
    'In Stock'
  ),
  (
    'essential-oversized-shirt',
    'Essential Oversized Shirt',
    1899,
    'The Essential Oversized Shirt redefines casual luxury. Cut from a soft cotton-linen blend with a boxy silhouette.',
    'Shirts',
    '[{"name": "Off White", "hex": "#f5f0e8"}, {"name": "Slate Black", "hex": "#1c1c1e"}]'::jsonb,
    '["S", "M", "L", "XL"]'::jsonb,
    '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"]'::jsonb,
    'New',
    false,
    true,
    'Cotton-Linen Blend',
    'Dry clean or hand wash cold.',
    'In Stock'
  ),
  (
    'elevated-emerald-dress-shirt',
    'Elevated Emerald Floral Dress Shirt',
    2499,
    'Crafted from 100% long-staple cotton with a luxurious satin finish. Features an exclusive emerald floral print, tailored spread collar, and smooth button closure.',
    'Shirts',
    '[{"name": "Emerald Teal", "hex": "#0f766e"}, {"name": "Sand Beige", "hex": "#d97706"}]'::jsonb,
    '["S", "M", "L", "XL", "XXL"]'::jsonb,
    '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"]'::jsonb,
    'Luxury',
    true,
    true,
    '100% Egyptian Cotton, Satin Finish',
    'Machine wash warm / Dry clean recommended. Warm iron.',
    'In Stock'
  )
ON CONFLICT (id) DO NOTHING;
