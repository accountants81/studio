import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Changed from Geist to Cairo for Arabic
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import AppProviders from "./AppProviders"; // New component to wrap client providers

const cairo = Cairo({ // Using Cairo font
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark"> {/* Set lang to Arabic, dir to RTL, and enable dark mode by default */}
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
