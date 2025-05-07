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
  isLoading: boolean; // General loading state for fetching orders
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "aaamo_orders";

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial load and potentially for add/update ops
  const { user } = useAuth(); 

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const storedOrdersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrdersJson) {
        try {
            const parsedOrders = JSON.parse(storedOrdersJson);
            // Ensure orderDate is a string and status is valid
            const validatedOrders = parsedOrders.map((order: any) => ({
                ...order,
                orderDate: typeof order.orderDate === 'string' ? order.orderDate : new Date(order.orderDate).toISOString(),
                status: ["pending", "processing", "shipped", "delivered", "cancelled"].includes(order.status) ? order.status : "pending",
            }));
            setOrders(validatedOrders);
        } catch (error) {
            console.error("Failed to parse orders from localStorage:", error);
            setOrders([]); // fallback to empty array on error
        }
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
    setIsLoading(true); // Indicate an operation is in progress
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: orderDetails.userId || user?.id, 
      items: orderDetails.items,
      address: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      totalAmount: orderDetails.totalAmount,
      shippingCost: orderDetails.shippingCost,
      orderDate: new Date().toISOString(),
      status: "pending",
    };
    const updatedOrders = [newOrder, ...orders]; 
    persistOrders(updatedOrders);
    setIsLoading(false); // Operation finished
    return newOrder;
  }, [orders, user]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]): Promise<Order | null> => {
    setIsLoading(true); // Indicate an operation is in progress
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      setIsLoading(false); // Operation finished (unsuccessfully)
      return null;
    }
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], status };
    persistOrders(updatedOrders);
    setIsLoading(false); // Operation finished
    return updatedOrders[orderIndex];
  }, [orders]);
  
  const getUserOrders = useCallback((): Order[] => {
    if (!user) return [];
    // Ensure sorting happens after filtering
    return orders.filter(order => order.userId === user.id).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, user]);

  const getAllOrders = useCallback((): Order[] => {
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
