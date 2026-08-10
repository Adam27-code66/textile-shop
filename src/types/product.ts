export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  colors: ProductColor[];
  sizes: Size[];
  images: string[];
  badge?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  material?: string;
  careInstructions?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type Size = 'S' | 'M' | 'L' | 'XL';

export type Category = 'T-Shirts' | 'Hoodies' | 'Shirts' | 'Pants' | 'Accessories';

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: Size;
  selectedColor: ProductColor;
}

export interface WishlistItem {
  productId: string;
}
