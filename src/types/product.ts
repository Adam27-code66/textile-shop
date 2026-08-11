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
  stockStatus?: 'In Stock' | 'Out of Stock' | 'Low Stock';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export type Category = 
  | 'T-Shirts' 
  | 'Hoodies' 
  | 'Shirts' 
  | 'Pants' 
  | 'Jeans'
  | 'Trousers'
  | 'Dresses'
  | 'Sarees'
  | 'Kids Wear'
  | 'Jackets'
  | 'Accessories'
  | string;

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
