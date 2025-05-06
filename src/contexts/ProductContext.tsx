// src/contexts/ProductContext.tsx
"use client";

import type { Product } from "@/types";
import { sampleProducts } from "@/lib/sample-data";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<Product>;
  editProduct: (product: Product) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  getProductById: (productId: string) => Product | undefined;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = "aaamo_products";

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProductsJson = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProductsJson) {
        setProducts(JSON.parse(storedProductsJson));
      } else {
        // Initialize with sample data if no products in localStorage
        setProducts(sampleProducts);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sampleProducts));
      }
    }
    setIsLoading(false);
  }, []);

  const persistProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    }
  };

  const addProduct = useCallback(async (productData: Omit<Product, "id">): Promise<Product> => {
    setIsLoading(true);
    const newProduct: Product = { ...productData, id: `prod_${Date.now()}` };
    const updatedProducts = [...products, newProduct];
    persistProducts(updatedProducts);
    setIsLoading(false);
    return newProduct;
  }, [products]);

  const editProduct = useCallback(async (updatedProduct: Product): Promise<Product | null> => {
    setIsLoading(true);
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    if (productIndex === -1) {
      setIsLoading(false);
      return null;
    }
    const updatedProducts = [...products];
    updatedProducts[productIndex] = updatedProduct;
    persistProducts(updatedProducts);
    setIsLoading(false);
    return updatedProduct;
  }, [products]);

  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    setIsLoading(true);
    const updatedProducts = products.filter(p => p.id !== productId);
    if (updatedProducts.length === products.length) {
      setIsLoading(false);
      return false; // Product not found
    }
    persistProducts(updatedProducts);
    setIsLoading(false);
    return true;
  }, [products]);

  const getProductById = useCallback((productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, getProductById, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
