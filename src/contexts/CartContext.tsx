// src/contexts/CartContext.tsx
"use client";

import type { CartItem, Product } from "@/types";
import { MIN_ORDER_VALUE } from "@/lib/constants";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isMinOrderValueMet: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aaamo_cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCartJson = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCartJson) {
        try {
          const parsedItems = JSON.parse(storedCartJson);
          // Basic validation for parsed items to ensure they fit CartItem structure loosely
          if (Array.isArray(parsedItems) && parsedItems.every(item => typeof item.id === 'string' && typeof item.quantity === 'number')) {
            setCartItems(parsedItems);
          } else {
            console.warn("Stored cart items are malformed, resetting cart.");
            localStorage.removeItem(CART_STORAGE_KEY);
            setCartItems([]);
          }
        } catch (e) {
          console.error("Failed to parse cart from localStorage:", e);
          localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted data
          setCartItems([]); // Reset to empty cart
        }
      }
    }
    setIsLoading(false);
  }, []);

  const persistCart = useCallback((updatedCartItems: CartItem[]) => {
    setCartItems(updatedCartItems);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
        // Potentially notify user or use a fallback if localStorage is unavailable/full
      }
    }
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setIsLoading(true);
    setCartItems(prevCartItems => {
        const existingItemIndex = prevCartItems.findIndex(item => item.id === product.id);
        let updatedCart;
        if (existingItemIndex > -1) {
          updatedCart = prevCartItems.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          updatedCart = [...prevCartItems, { ...product, quantity }];
        }
        persistCart(updatedCart); // persistCart now only calls localStorage, state is handled via setCartItems(updater)
        return updatedCart;
    });
    setIsLoading(false);
  }, [persistCart]);


  const removeFromCart = useCallback((productId: string) => {
    setIsLoading(true);
    setCartItems(prevCartItems => {
        const updatedCart = prevCartItems.filter(item => item.id !== productId);
        persistCart(updatedCart);
        return updatedCart;
    });
    setIsLoading(false);
  }, [persistCart]);


  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setIsLoading(true);
    if (quantity <= 0) {
      removeFromCart(productId); // This will manage its own state updates via setCartItems and persist
      // setIsLoading(false) is handled by removeFromCart
      return; 
    }
    setCartItems(prevCartItems => {
        const updatedCart = prevCartItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        persistCart(updatedCart);
        return updatedCart;
    });
    setIsLoading(false);
  }, [removeFromCart, persistCart]);

  const clearCart = useCallback(() => {
    setIsLoading(true);
    persistCart([]);
    setCartItems([]); // ensure state is also cleared immediately
    setIsLoading(false);
  }, [persistCart]);

  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);
  
  const getCartItemCount = useCallback((): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const isMinOrderValueMet = getCartTotal() >= MIN_ORDER_VALUE;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount, isMinOrderValueMet, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
