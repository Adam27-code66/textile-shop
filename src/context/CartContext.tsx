'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Size, ProductColor } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: Size, color: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, size: Size, colorName: string) => void;
  updateQuantity: (productId: string, size: Size, colorName: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('area51-cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem('area51-cart');
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('area51-cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (product: Product, size: Size, color: ProductColor, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor.name === color.name
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, size: Size, colorName: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: Size, colorName: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.name === colorName
            ? { ...item, quantity }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 1999 ? 0 : 149;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, shipping, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
