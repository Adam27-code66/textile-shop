'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { products as initialProducts } from '@/data/products';

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
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check local storage custom edits first for offline resilience
      const localProductsStr = localStorage.getItem('area51_dynamic_products');
      let baseItems: Product[] = initialProducts;

      if (localProductsStr) {
        try {
          baseItems = JSON.parse(localProductsStr);
        } catch (e) {
          console.warn('Could not parse local products array:', e);
        }
      }

      // Fetch from API
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const formatted: Product[] = json.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            description: item.description || '',
            category: item.category,
            colors: Array.isArray(item.colors) ? item.colors : [],
            sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
            images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
            badge: item.badge || undefined,
            isFeatured: Boolean(item.is_featured ?? item.isFeatured),
            isNewArrival: Boolean(item.is_new_arrival ?? item.isNewArrival),
            material: item.material,
            careInstructions: item.care_instructions || item.careInstructions,
            stockStatus: item.stock_status || item.stockStatus || 'In Stock'
          }));

          setProductsList(formatted);
          localStorage.setItem('area51_dynamic_products', JSON.stringify(formatted));
          setIsLoading(false);
          return;
        }
      }

      setProductsList(baseItems);
    } catch (err: any) {
      console.warn('API products load error, using local dataset:', err);
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

      // Call API
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'ADMIN'
        },
        body: JSON.stringify(fullProduct)
      });

      // Update state locally immediately
      const updatedList = [fullProduct, ...productsList.filter((p) => p.id !== fullProduct.id)];
      setProductsList(updatedList);
      localStorage.setItem('area51_dynamic_products', JSON.stringify(updatedList));

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          return { success: true };
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to add product' };
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const existing = productsList.find((p) => p.id === id);
      if (!existing) return { success: false, error: 'Product not found' };

      const merged: Product = { ...existing, ...updatedData };

      // Call API
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'ADMIN'
        },
        body: JSON.stringify(merged)
      });

      const updatedList = productsList.map((p) => (p.id === id ? merged : p));
      setProductsList(updatedList);
      localStorage.setItem('area51_dynamic_products', JSON.stringify(updatedList));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update product' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'ADMIN'
        }
      });

      const updatedList = productsList.filter((p) => p.id !== id);
      setProductsList(updatedList);
      localStorage.setItem('area51_dynamic_products', JSON.stringify(updatedList));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete product' };
    }
  };

  const addCategory = async (catName: string) => {
    if (!categoriesList.includes(catName)) {
      const nextCategories = [...categoriesList, catName];
      setCategoriesList(nextCategories);
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
