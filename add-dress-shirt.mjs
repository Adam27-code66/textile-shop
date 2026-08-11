import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ysvhiisbwsfhlpowczsn.supabase.co';
const supabaseKey = 'sb_publishable_4SDOBi3re_UwokXMWxnEig_5JSfaQBC';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addProduct() {
  const newProduct = {
    id: 'elevated-emerald-dress-shirt',
    name: 'Elevated Emerald Floral Dress Shirt',
    price: 2499,
    description: 'Crafted from 100% long-staple cotton with a luxurious satin finish. Features an exclusive emerald floral print, tailored spread collar, and smooth button closure designed to elevate formal and smart-casual outfits.',
    category: 'Shirts',
    colors: [
      { name: 'Emerald Teal', hex: '#0f766e' },
      { name: 'Sand Beige', hex: '#d97706' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
    ],
    badge: 'Luxury',
    is_featured: true,
    is_new_arrival: true,
    material: '100% Egyptian Cotton, Satin Finish',
    care_instructions: 'Machine wash warm / Dry clean recommended. Warm iron.'
  };

  const { data, error } = await supabase.from('products').upsert([newProduct]);

  if (error) {
    console.error('Error inserting product:', error.message);
  } else {
    console.log('Successfully added new product to Supabase!');
  }
}

addProduct();
