'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { products as hardcodedProducts } from '@/data/products';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (newProductData: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  categories: string[];
  addCategory: (categoryName: string) => Promise<{ success: boolean; error?: string }>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = [
  'All',
  'T-Shirts',
  'Shirts',
  'Hoodies',
  'Pants',
  'Jackets',
  'Dresses',
  'Sarees',
  'Kids Wear',
  'Accessories'
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProductsList(json.data);
          return;
        }
      }
      // If API returns empty, use hardcoded products
      setProductsList(hardcodedProducts);
    } catch (err: any) {
      console.warn('Failed to fetch products from API:', err);
      setProductsList(hardcodedProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (newProductData: Partial<Product>) => {
    try {
      const generatedId = newProductData.id || 
        (newProductData.name || 'product')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const fullProduct: Product = {
        id: generatedId,
        name: newProductData.name || 'New Apparel Item',
        price: Number(newProductData.price || 999),
        description: newProductData.description || '',
        category: newProductData.category || 'T-Shirts',
        colors: newProductData.colors && newProductData.colors.length > 0
          ? newProductData.colors
          : [{ name: 'Default', hex: '#1a1a1a' }],
        sizes: newProductData.sizes || ['S', 'M', 'L', 'XL'],
        images: newProductData.images && newProductData.images.length > 0
          ? newProductData.images
          : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
        badge: newProductData.badge,
        isFeatured: newProductData.isFeatured || false,
        isNewArrival: newProductData.isNewArrival || false,
        material: newProductData.material || '100% Premium Cotton',
        careInstructions: newProductData.careInstructions || 'Machine wash cold.',
        stockStatus: newProductData.stockStatus || 'In Stock'
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'ADMIN'
        },
        body: JSON.stringify(fullProduct)
      });

      const json = await res.json();

      if (!json.success) {
        return { success: false, error: json.error || 'Failed to save product to database' };
      }

      // Refresh the full product list from database
      await fetchProducts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to add product' };
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'ADMIN'
        },
        body: JSON.stringify(updatedData)
      });

      const json = await res.json();

      if (!json.success) {
        return { success: false, error: json.error || 'Failed to update product in database' };
      }

      // Refresh the full product list from database
      await fetchProducts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update product' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'ADMIN'
        }
      });

      const json = await res.json();

      if (!json.success) {
        return { success: false, error: json.error || 'Failed to delete product from database' };
      }

      // Refresh the full product list from database
      await fetchProducts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete product' };
    }
  };

  const addCategory = async (catName: string) => {
    if (!categoriesList.includes(catName)) {
      setCategoriesList([...categoriesList, catName]);
    }
    return { success: true };
  };

  return (
    <ProductContext.Provider
      value={{
        products: productsList,
        isLoading,
        error,
        refreshProducts: fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        categories: categoriesList,
        addCategory
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
