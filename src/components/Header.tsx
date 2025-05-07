// src/components/Header.tsx
"use client";

import Link from "next/link";
import { ShoppingCart, User as UserIcon, LogIn, LogOut, ShieldCheck, Menu, Search, PackagePlus, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { SITE_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useState } from "react"; // useEffect removed as local cartCount state is removed
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart(); // getCartItemCount can also be used if preferred
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Calculate cart count directly from cartItems for reliable reactivity
  const currentCartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  const mobileNavLinks = [
    ...navLinks,
    ...(user && isAdmin ? [
        { href: "/admin/dashboard", label: "لوحة التحكم", icon: <ShieldCheck className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> }, 
        { href: "/admin/products/new", label: "إضافة منتج", icon: <PackagePlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> }, 
        { href: "/admin/orders", label: "إدارة الطلبات", icon: <ListOrdered className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> }
    ] : []),
     ...(user ? [ // Add "My Orders" for any logged-in user
      { href: "/orders/history", label: "طلباتي", icon: <ListOrdered className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> }
    ] : [])
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="mr-4 flex items-center space-x-2 rtl:space-x-reverse shrink-0">
          <span className="font-bold text-xl sm:text-2xl text-primary">{SITE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium rtl:space-x-reverse">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2 rtl:space-x-reverse">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md ml-2 sm:ml-4">
            <Input
              type="search"
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md pl-8 pr-2 text-foreground placeholder:text-muted-foreground text-sm"
            />
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </form>

          <Link href="/cart" aria-label="عربة التسوق">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {currentCartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {currentCartItemCount}
                </Badge>
              )}
              <span className="sr-only">عربة التسوق</span>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                   <span className="sr-only">قائمة المستخدم</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center w-full">
                        <ShieldCheck className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                        <span>لوحة التحكم</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href="/admin/products/new" className="flex items-center w-full">
                        <PackagePlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                        <span>إضافة منتج</span>
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link href="/admin/orders" className="flex items-center w-full">
                        <ListOrdered className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                        <span>إدارة الطلبات</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                 <DropdownMenuItem asChild>
                    <Link href="/orders/history" className="flex items-center w-full">
                        <ListOrdered className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                        <span>طلباتي</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive hover:!text-destructive flex items-center cursor-pointer w-full focus:bg-destructive/10 focus:!text-destructive">
                  <LogOut className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" aria-label="تسجيل الدخول">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">تسجيل الدخول</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuGroup>
                  {mobileNavLinks
                    .filter(link => user || (!link.href.startsWith('/admin') && link.href !== '/orders/history')) // Filter admin/order links if not logged in
                    .map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="flex items-center w-full text-md py-2 px-3">
                        {link.icon}
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   {user && (
                     <DropdownMenuItem onClick={logout} className="text-destructive hover:!text-destructive flex items-center cursor-pointer w-full text-md py-2 px-3 focus:bg-destructive/10 focus:!text-destructive">
                      <LogOut className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                   )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
