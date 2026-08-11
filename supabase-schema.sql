-- Create Products Table in Supabase
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

-- Insert Sample Products into Supabase
INSERT INTO public.products (id, name, price, description, category, colors, sizes, images, badge, is_featured, is_new_arrival, material, care_instructions)
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
    'Machine wash cold. Tumble dry low.'
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
    'Machine wash cold inside out.'
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
    'Dry clean or hand wash cold.'
  )
ON CONFLICT (id) DO NOTHING;
