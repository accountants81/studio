// src/app/AppProviders.tsx
"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext"; // Import OrderProvider
import { ThemeProvider } from "next-themes"; // Import ThemeProvider for dark mode toggle (optional)

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider> {/* Add OrderProvider */}
              {children}
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
