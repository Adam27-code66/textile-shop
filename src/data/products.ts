import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'archive-oversized-tee',
    name: 'Archive Oversized Tee',
    price: 1299,
    description: 'A staple piece from the Archive collection. This oversized tee features a relaxed drop-shoulder silhouette crafted from premium 240 GSM cotton. Designed for those who value comfort without compromising on style.',
    category: 'T-Shirts',
    colors: [
      { name: 'Obsidian Black', hex: '#1a1a1a' },
      { name: 'Phantom Grey', hex: '#4a4a4a' },
      { name: 'Archive White', hex: '#f0f0f0' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    ],
    badge: 'Bestseller',
    isFeatured: true,
    material: '100% Premium Cotton, 240 GSM',
    careInstructions: 'Machine wash cold. Tumble dry low. Do not bleach.',
  },
  {
    id: 'signature-graphic-tee',
    name: 'Signature Graphic Tee',
    price: 1499,
    description: 'Express your identity with our Signature Graphic Tee. Features an exclusive AREA 51 print on heavyweight cotton. The relaxed fit and ribbed collar ensure all-day comfort with a street-ready edge.',
    category: 'T-Shirts',
    colors: [
      { name: 'Deep Black', hex: '#0d0d0d' },
      { name: 'Washed Charcoal', hex: '#3d3d3d' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    isFeatured: true,
    isNewArrival: true,
    material: '100% Cotton, 220 GSM',
    careInstructions: 'Machine wash cold inside out. Hang dry.',
  },
  {
    id: 'essential-oversized-shirt',
    name: 'Essential Oversized Shirt',
    price: 1899,
    description: 'The Essential Oversized Shirt redefines casual luxury. Cut from a soft cotton-linen blend with a boxy silhouette, this piece transitions effortlessly from day to night. Featuring a clean button-down front and minimal branding.',
    category: 'Shirts',
    colors: [
      { name: 'Off White', hex: '#f5f0e8' },
      { name: 'Slate Black', hex: '#1c1c1e' },
      { name: 'Stone Beige', hex: '#c4b5a0' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80',
    ],
    isFeatured: true,
    material: '60% Cotton, 40% Linen',
    careInstructions: 'Machine wash cold. Iron on low heat.',
  },
  {
    id: 'elevated-emerald-dress-shirt',
    name: 'Elevated Emerald Floral Dress Shirt',
    price: 2499,
    description: 'Crafted from 100% long-staple cotton with a luxurious satin finish. Features an exclusive emerald floral print, tailored spread collar, and smooth button closure designed to elevate formal and smart-casual outfits.',
    category: 'Shirts',
    colors: [
      { name: 'Emerald Teal', hex: '#0f766e' },
      { name: 'Sand Beige', hex: '#d97706' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    ],
    badge: 'Luxury',
    isFeatured: true,
    isNewArrival: true,
    material: '100% Egyptian Cotton, Satin Finish',
    careInstructions: 'Machine wash warm / Dry clean recommended. Warm iron.',
  },
  {
    id: 'archive-hoodie',
    name: 'Archive Hoodie',
    price: 2499,
    description: 'The Archive Hoodie is built for the streets. Heavyweight 380 GSM French terry with a structured hood, kangaroo pocket, and ribbed cuffs. Minimal branding keeps it versatile, while the weight keeps it premium.',
    category: 'Hoodies',
    colors: [
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Storm Grey', hex: '#5c5c5c' },
      { name: 'Deep Purple', hex: '#4a1a6b' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
    ],
    badge: 'Limited',
    isFeatured: true,
    isNewArrival: true,
    material: '100% Cotton French Terry, 380 GSM',
    careInstructions: 'Machine wash cold. Do not tumble dry. Hang dry.',
  },
  {
    id: 'classic-cargo-pants',
    name: 'Classic Cargo Pants',
    price: 2199,
    description: 'Engineered for movement and built with purpose. These cargo pants feature a relaxed tapered fit with six functional pockets, adjustable ankle cuffs, and a reinforced waistband. Perfect for everyday versatility.',
    category: 'Pants',
    colors: [
      { name: 'Tactical Black', hex: '#0f0f0f' },
      { name: 'Olive Drab', hex: '#4a5338' },
      { name: 'Sand', hex: '#c2b280' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    ],
    isNewArrival: true,
    material: '98% Cotton, 2% Elastane Twill',
    careInstructions: 'Machine wash cold. Tumble dry low.',
  },
  {
    id: 'everyday-oversized-tee',
    name: 'Everyday Oversized Tee',
    price: 1199,
    description: 'Your new daily essential. The Everyday Oversized Tee is cut from soft-washed cotton with a relaxed fit that drapes perfectly. Minimal design, maximum comfort — the foundation of any wardrobe.',
    category: 'T-Shirts',
    colors: [
      { name: 'Washed Black', hex: '#2a2a2a' },
      { name: 'Cloud White', hex: '#fafafa' },
      { name: 'Dusty Mauve', hex: '#b8a0a0' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    ],
    material: '100% Combed Cotton, 200 GSM',
    careInstructions: 'Machine wash cold. Tumble dry low.',
  },
  {
    id: 'urban-zip-hoodie',
    name: 'Urban Zip Hoodie',
    price: 2799,
    description: 'The Urban Zip Hoodie combines streetwear aesthetics with premium craftsmanship. Full-length YKK zipper, split kangaroo pockets, and a structured double-layered hood. The subtle embroidered logo adds a clean finishing touch.',
    category: 'Hoodies',
    colors: [
      { name: 'Carbon Black', hex: '#1a1a1a' },
      { name: 'Ash Grey', hex: '#6b6b6b' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    ],
    isNewArrival: true,
    material: '80% Cotton, 20% Polyester Fleece, 360 GSM',
    careInstructions: 'Machine wash cold inside out. Do not bleach. Hang dry.',
  },
  {
    id: 'structured-overshirt',
    name: 'Structured Overshirt',
    price: 2299,
    description: 'A wardrobe bridge piece that works as a shirt or a light jacket. The Structured Overshirt features a heavy cotton twill body, chest pockets, and a relaxed boxy fit. Layer it or wear it solo.',
    category: 'Shirts',
    colors: [
      { name: 'Jet Black', hex: '#0a0a0a' },
      { name: 'Army Green', hex: '#3d4a2d' },
      { name: 'Espresso', hex: '#3c2415' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    ],
    material: '100% Cotton Twill, 280 GSM',
    careInstructions: 'Machine wash cold. Iron on medium heat.',
  },
  {
    id: 'relaxed-joggers',
    name: 'Relaxed Joggers',
    price: 1999,
    description: 'Engineered for comfort with an elevated look. These joggers feature a tapered leg, elasticated waistband with drawcord, and deep pockets. Made from a soft cotton-blend fleece that gets better with every wash.',
    category: 'Pants',
    colors: [
      { name: 'Night Black', hex: '#121212' },
      { name: 'Heather Grey', hex: '#8a8a8a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    ],
    isNewArrival: true,
    material: '75% Cotton, 25% Polyester Fleece',
    careInstructions: 'Machine wash cold. Tumble dry low.',
  },
  {
    id: 'area51-cap',
    name: 'AREA 51 Cap',
    price: 899,
    description: 'Top off your look with the AREA 51 Cap. Unstructured six-panel design with an embroidered logo, brass clasp closure, and pre-curved brim. One size fits most.',
    category: 'Accessories',
    colors: [
      { name: 'Black', hex: '#0d0d0d' },
      { name: 'Navy', hex: '#1a1a3e' },
    ],
    sizes: ['M'],
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    ],
    material: '100% Cotton Twill',
    careInstructions: 'Spot clean only.',
  },
  {
    id: 'minimal-crossbody-bag',
    name: 'Minimal Crossbody Bag',
    price: 1599,
    description: 'Carry your essentials in style. This minimal crossbody bag features a durable nylon body, adjustable strap, and multiple compartments. Compact yet spacious enough for your daily carry.',
    category: 'Accessories',
    colors: [
      { name: 'Stealth Black', hex: '#0a0a0a' },
      { name: 'Slate Grey', hex: '#4e4e4e' },
    ],
    sizes: ['M'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    badge: 'New',
    isNewArrival: true,
    material: '100% Recycled Nylon',
    careInstructions: 'Wipe clean with damp cloth.',
  },
  {
    id: 'distressed-wide-leg',
    name: 'Distressed Wide Leg Pants',
    price: 2399,
    description: 'Make a statement with our Distressed Wide Leg Pants. Vintage-washed denim with strategic distressing, a relaxed wide-leg silhouette, and a high-rise waist. Built for those who dress with intention.',
    category: 'Pants',
    colors: [
      { name: 'Washed Black', hex: '#2d2d2d' },
      { name: 'Vintage Blue', hex: '#4a6a8a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    ],
    material: '100% Cotton Denim, 12oz',
    careInstructions: 'Machine wash cold inside out. Hang dry.',
  },
  {
    id: 'heavyweight-pocket-tee',
    name: 'Heavyweight Pocket Tee',
    price: 1399,
    description: 'A premium take on the classic pocket tee. Made from heavyweight cotton with a chest pocket detail and reinforced seams. The slightly boxy fit gives it a modern, elevated feel.',
    category: 'T-Shirts',
    colors: [
      { name: 'True Black', hex: '#0f0f0f' },
      { name: 'Bone White', hex: '#e8e0d5' },
      { name: 'Olive', hex: '#5a6e4a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    ],
    material: '100% Heavyweight Cotton, 260 GSM',
    careInstructions: 'Machine wash cold. Tumble dry low.',
  },
  {
    id: 'archive-pullover-hoodie',
    name: 'Archive Pullover Hoodie',
    price: 2699,
    description: 'The definitive pullover hoodie from the Archive collection. Garment-dyed for a vintage feel with a relaxed fit, oversized hood, and raw-edge details. Each piece develops a unique patina over time.',
    category: 'Hoodies',
    colors: [
      { name: 'Faded Black', hex: '#2a2a2a' },
      { name: 'Washed Purple', hex: '#5a3a6a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
    ],
    badge: 'Archive',
    isNewArrival: true,
    material: '100% Cotton French Terry, 400 GSM (Garment Dyed)',
    careInstructions: 'Machine wash cold. Do not bleach. Hang dry.',
  },
  {
    id: 'linen-resort-shirt',
    name: 'Linen Resort Shirt',
    price: 2099,
    description: 'Effortless summer style. This resort shirt is cut from pure linen with a camp collar, relaxed fit, and coconut shell buttons. Perfect for warm-weather layering or wearing on its own.',
    category: 'Shirts',
    colors: [
      { name: 'Natural', hex: '#e8dcc8' },
      { name: 'Black', hex: '#111111' },
      { name: 'Sage', hex: '#8a9a6e' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    ],
    material: '100% French Linen',
    careInstructions: 'Machine wash cold. Iron on low heat while damp.',
  },
  {
    id: 'area51-beanie',
    name: 'AREA 51 Beanie',
    price: 799,
    description: 'Keep it warm, keep it clean. The AREA 51 Beanie is knit from soft acrylic-wool blend with an embroidered logo patch. Ribbed construction ensures a snug, comfortable fit.',
    category: 'Accessories',
    colors: [
      { name: 'Black', hex: '#0d0d0d' },
      { name: 'Charcoal', hex: '#3a3a3a' },
      { name: 'Deep Purple', hex: '#3d1a5c' },
    ],
    sizes: ['M'],
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    ],
    material: '70% Acrylic, 30% Wool',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
  },
];

export const categories = ['All', 'T-Shirts', 'Hoodies', 'Shirts', 'Pants', 'Accessories'] as const;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

export function sortProducts(items: Product[], sort: string): Product[] {
  const sorted = [...items];
  switch (sort) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}
