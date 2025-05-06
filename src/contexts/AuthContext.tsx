// src/contexts/AuthContext.tsx
"use client";

import type { User } from "@/types";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/constants";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user storage (replace with actual API calls)
const MOCK_USERS_STORAGE_KEY = "aaamo_users";
const LOGGED_IN_USER_STORAGE_KEY = "aaamo_loggedInUser";

const getMockUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const usersJson = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveMockUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize admin user if not present
    let users = getMockUsers();
    if (!users.find(u => u.email === ADMIN_EMAIL)) {
      users.push({ id: "admin_user", email: ADMIN_EMAIL, isAdmin: true, name: "Admin" });
      saveMockUsers(users);
    }
    
    // Load logged-in user from localStorage
    const storedUserJson = localStorage.getItem(LOGGED_IN_USER_STORAGE_KEY);
    if (storedUserJson) {
      setUser(JSON.parse(storedUserJson));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Admin login
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      const adminUser: User = { id: "admin_user", email: ADMIN_EMAIL, isAdmin: true, name: "مسؤول" };
      setUser(adminUser);
      localStorage.setItem(LOGGED_IN_USER_STORAGE_KEY, JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }

    // Regular user login
    const users = getMockUsers();
    const foundUser = users.find(u => u.email === email); // Password check is omitted for this mock

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(LOGGED_IN_USER_STORAGE_KEY, JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const signup = useCallback(async (email: string, pass: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getMockUsers();
    if (users.find(u => u.email === email)) {
      setIsLoading(false);
      return false; // User already exists
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      isAdmin: false,
      name: name || email.split('@')[0],
    };
    users.push(newUser);
    saveMockUsers(users);
    setUser(newUser);
    localStorage.setItem(LOGGED_IN_USER_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOGGED_IN_USER_STORAGE_KEY);
    router.push("/"); // Redirect to home on logout
  }, [router]);

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
