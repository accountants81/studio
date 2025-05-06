
// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  // Add other user-specific fields if needed
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in EGP
  images: string[]; // Array of image URLs or base64 strings
  category: string; // e.g., "Cases", "Screen Protectors", "Chargers"
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  governorate: string;
  addressLine: string;
  distinctiveMark?: string;
  email?: string;
}

export type PaymentMethod = "vodafone_cash" | "fawry" | "cash_on_delivery";

export interface Order {
  id: string;
  userId?: string; // Link to user if logged in
  items: CartItem[];
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  totalAmount: number; // Includes products + shipping
  shippingCost: number;
  orderDate: string; // ISO date string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface Governorate {
  id: string;
  name: string;
  shippingCost: number; // Pre-defined or fetched
}
