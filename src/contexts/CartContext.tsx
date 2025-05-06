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
        setCartItems(JSON.parse(storedCartJson));
      }
    }
    setIsLoading(false);
  }, []);

  const persistCart = (updatedCartItems: CartItem[]) => {
    setCartItems(updatedCartItems);
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCartItems));
    }
  };

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setIsLoading(true);
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = cartItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity }];
    }
    persistCart(updatedCart);
    setIsLoading(false);
  }, [cartItems]);

  const removeFromCart = useCallback((productId: string) => {
    setIsLoading(true);
    const updatedCart = cartItems.filter(item => item.id !== productId);
    persistCart(updatedCart);
    setIsLoading(false);
  }, [cartItems]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setIsLoading(true);
    if (quantity <= 0) {
      removeFromCart(productId);
      setIsLoading(false);
      return;
    }
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    persistCart(updatedCart);
    setIsLoading(false);
  }, [cartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setIsLoading(true);
    persistCart([]);
    setIsLoading(false);
  }, []);

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
