// src/contexts/OrderContext.tsx
"use client";

import type { Order, OrderAddress, CartItem, PaymentMethod } from "@/types";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext"; // To associate orders with users

interface OrderContextType {
  orders: Order[];
  addOrder: (orderDetails: {
    items: CartItem[];
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    shippingCost: number;
    userId?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<Order | null>;
  getUserOrders: () => Order[];
  getAllOrders: () // For admin
    => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "aaamo_orders";

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Get current user for associating orders

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrdersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrdersJson) {
        setOrders(JSON.parse(storedOrdersJson));
      }
    }
    setIsLoading(false);
  }, []);

  const persistOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    if (typeof window !== "undefined") {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    }
  };

  const addOrder = useCallback(async (orderDetails: {
    items: CartItem[];
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    shippingCost: number;
    userId?: string;
  }): Promise<Order> => {
    setIsLoading(true);
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: orderDetails.userId || user?.id, // Use passed userId or current logged-in user's ID
      items: orderDetails.items,
      address: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      totalAmount: orderDetails.totalAmount,
      shippingCost: orderDetails.shippingCost,
      orderDate: new Date().toISOString(),
      status: "pending",
    };
    const updatedOrders = [newOrder, ...orders]; // Add to the beginning of the list
    persistOrders(updatedOrders);
    setIsLoading(false);
    return newOrder;
  }, [orders, user]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]): Promise<Order | null> => {
    setIsLoading(true);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      setIsLoading(false);
      return null;
    }
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], status };
    persistOrders(updatedOrders);
    setIsLoading(false);
    return updatedOrders[orderIndex];
  }, [orders]);
  
  const getUserOrders = useCallback((): Order[] => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, user]);

  const getAllOrders = useCallback((): Order[] => {
     // In a real app, this would be admin-protected
    return [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders]);

  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  }, [orders]);


  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getUserOrders, getAllOrders, getOrderById, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
