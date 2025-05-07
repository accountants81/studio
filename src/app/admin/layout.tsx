// src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, LayoutDashboard, Package, ShoppingCart, LogOut, Settings, Users, BarChart3, PlusCircle, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";


interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
  exact?: boolean; // For matching exact path
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isLoading, logout: authLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/admin/dashboard");
    } else if (!isLoading && user && !isAdmin) {
      router.replace("/"); // Or a specific "access denied" page
    }
  }, [user, isAdmin, isLoading, router]);

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={20} />, exact: true },
    {
      href: "/admin/products",
      label: "المنتجات",
      icon: <Package size={20} />,
      subItems: [
        { href: "/admin/products", label: "كل المنتجات", icon: <Package size={18} />, exact: true },
        { href: "/admin/products/new", label: "إضافة منتج جديد", icon: <PlusCircle size={18} />, exact: true },
      ]
    },
    { href: "/admin/orders", label: "الطلبات", icon: <ShoppingCart size={20} />, exact: true },
    // { href: "/admin/customers", label: "العملاء", icon: <Users size={20} /> },
    // { href: "/admin/reports", label: "التقارير", icon: <BarChart3 size={20} /> },
    // { href: "/admin/settings", label: "الإعدادات", icon: <Settings size={20} /> },
  ];

  // Determine active accordion based on pathname
  useEffect(() => {
    const activeParent = navItems.find(item => item.subItems?.some(sub => pathname.startsWith(sub.href)));
    if (activeParent) {
      setOpenAccordion(activeParent.label);
    }
  }, [pathname, navItems]);


  if (isLoading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background admin-layout">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">جارِ التحقق من صلاحيات المسؤول...</p>
      </div>
    );
  }
  
  const renderNavItems = (items: NavItem[], isSubmenu = false) => {
    return items.map((item) => {
      const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
      const itemClass = cn(
        "flex items-center px-3 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] transition-colors",
        isActive ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-semibold" : "text-[var(--sidebar-foreground)]/90"
      );
      const subItemClass = cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--sidebar-accent)]/80 hover:text-[var(--sidebar-accent-foreground)] transition-colors",
        isActive ? "bg-[var(--sidebar-accent)]/80 text-[var(--sidebar-accent-foreground)] font-semibold" : "text-[var(--sidebar-foreground)]/80"
      );

      if (item.subItems) {
        return (
          <AccordionItem key={item.label} value={item.label} className="border-b-0">
            <AccordionTrigger
              className={cn(
                itemClass,
                "justify-between w-full",
                pathname.startsWith(item.href) && !item.exact && "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-semibold" // Highlight parent if child is active
              )}
            >
              <div className="flex items-center">
                <span className="ml-3 rtl:mr-3 rtl:ml-0">{item.icon}</span>
                {item.label}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <ul className="space-y-1 mr-4 rtl:ml-4 rtl:mr-0 border-r-2 border-[var(--sidebar-primary)]/30 pr-3 rtl:border-l-2 rtl:border-r-0 rtl:pl-3">
                {item.subItems.map(subItem => {
                  const isSubItemActive = subItem.exact ? pathname === subItem.href : pathname.startsWith(subItem.href);
                  return (
                    <li key={subItem.label}>
                      <Link href={subItem.href}>
                        <span
                          className={cn(
                            subItemClass,
                            isSubItemActive ? "bg-[var(--sidebar-accent)]/80 text-[var(--sidebar-accent-foreground)] font-semibold" : "text-[var(--sidebar-foreground)]/80"
                          )}
                        >
                          <span className="ml-3 rtl:mr-3 rtl:ml-0">{subItem.icon}</span>
                          {subItem.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      }
      return (
        <Link key={item.href} href={item.href}>
          <span className={itemClass}>
            <span className="ml-3 rtl:mr-3 rtl:ml-0">{item.icon}</span>
            {item.label}
          </span>
        </Link>
      );
    });
  };


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="admin-layout"> {/* Root for admin-specific theming */}
        <Sidebar 
          side="right" 
          collapsible="icon" 
          variant="sidebar" 
          className="border-l rtl:border-r rtl:border-l-0 shadow-lg"
        >
          <SidebarHeader className="p-4 border-b text-center border-[var(--sidebar-border)]">
            <Link href="/admin/dashboard" className="block group-data-[collapsible=icon]:hidden">
              <h2 className="text-xl font-bold text-[var(--sidebar-primary)]">{SITE_NAME} - لوحة التحكم</h2>
            </Link>
             <Link href="/admin/dashboard" className="hidden group-data-[collapsible=icon]:block mx-auto">
               <LayoutDashboard size={24} className="text-[var(--sidebar-primary)]"/>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <ScrollArea className="h-full">
              <nav className="flex-grow p-2 space-y-1">
                <Accordion type="single" collapsible className="w-full" value={openAccordion} onValueChange={setOpenAccordion}>
                    {renderNavItems(navItems)}
                </Accordion>
              </nav>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-[var(--sidebar-border)]">
             <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square" onClick={authLogout}>
                    <LogOut size={20} className="ml-3 rtl:mr-3 rtl:ml-0 group-data-[collapsible=icon]:m-0" />
                    <span className="group-data-[collapsible=icon]:hidden">تسجيل الخروج</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="group-data-[collapsible=expanded]:hidden">
                  تسجيل الخروج
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-3">
            <SidebarTrigger className="md:hidden" /> {/* Mobile toggle */}
            <div className="flex-1">
              {/* Breadcrumbs or other header content can go here */}
            </div>
            <div className="hidden md:block">
               <SidebarTrigger /> {/* Desktop toggle for icon mode */}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// For Tooltip (used in SidebarFooter when collapsed)
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

