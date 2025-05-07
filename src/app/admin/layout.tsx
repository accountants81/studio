// src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, LayoutDashboard, Package, ShoppingCart, LogOut, Settings, Users, BarChart3, PlusCircle, Menu as MenuIcon, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar, SidebarProvider, SidebarContent, SidebarHeader as UISidebarHeader, SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar"; // Keep for context
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
  exact?: boolean; // For matching exact path
}

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading: authIsLoading, logout: authLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  
  // States for controlling desktop and mobile sheets
  const [isDesktopSheetOpen, setIsDesktopSheetOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);


  useEffect(() => {
    if (!authIsLoading && !user) {
      router.replace("/login?redirect=/admin/dashboard");
    } else if (!authIsLoading && user && !isAdmin) {
      router.replace("/"); 
    }
  }, [user, isAdmin, authIsLoading, router]);

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
  ];

  useEffect(() => {
    const activeParent = navItems.find(item => item.subItems?.some(sub => pathname.startsWith(sub.href)));
    if (activeParent) {
      setOpenAccordion(activeParent.label);
    } else {
      // If no subitem is active, check if a top-level item is active and collapse accordion.
      const isTopLevelActive = navItems.some(item => !item.subItems && (item.exact ? pathname === item.href : pathname.startsWith(item.href)));
      if(isTopLevelActive) {
        setOpenAccordion(undefined);
      }
    }
  }, [pathname, navItems]);


  if (authIsLoading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background admin-layout">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">جارِ التحقق من صلاحيات المسؤول...</p>
      </div>
    );
  }
  
  const closeSheet = () => {
    setIsDesktopSheetOpen(false);
    setIsMobileSheetOpen(false);
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
                pathname.startsWith(item.href) && !item.exact && "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-semibold" 
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
                      <Link href={subItem.href} onClick={closeSheet}>
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
        <Link key={item.href} href={item.href} onClick={closeSheet}>
          <span className={itemClass}>
            <span className="ml-3 rtl:mr-3 rtl:ml-0">{item.icon}</span>
            {item.label}
          </span>
        </Link>
      );
    });
  };

  const sidebarNavigation = (
    <>
      <UISidebarHeader className="p-4 border-b text-center border-[var(--sidebar-border)]">
        <Link href="/admin/dashboard" onClick={closeSheet} className="block">
          <h2 className="text-xl font-bold text-[var(--sidebar-primary)]">{SITE_NAME} - لوحة التحكم</h2>
        </Link>
      </UISidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <nav className="flex-grow p-2 space-y-1">
            <Accordion type="single" collapsible className="w-full" value={openAccordion} onValueChange={setOpenAccordion}>
                {renderNavItems(navItems)}
            </Accordion>
          </nav>
        </ScrollArea>
      </SidebarContent>
      <UISidebarFooter className="p-2 border-t border-[var(--sidebar-border)]">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80" onClick={() => { authLogout(); closeSheet(); }}>
                <LogOut size={20} className="ml-3 rtl:mr-3 rtl:ml-0" />
                <span>تسجيل الخروج</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              تسجيل الخروج
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </UISidebarFooter>
    </>
  );

  return (
    <div className="admin-layout flex flex-col min-h-screen">
      {/* Mobile Sidebar - Sheet */}
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent side="right" className="w-3/4 p-0 flex flex-col bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] border-[var(--sidebar-border)]">
           <SheetHeader className="p-0"> {/* Use SheetHeader for title and close */}
             {/* The UISidebarHeader will be part of sidebarNavigation */}
           </SheetHeader>
           {sidebarNavigation}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Sheet */}
      <Sheet open={isDesktopSheetOpen} onOpenChange={setIsDesktopSheetOpen}>
        <SheetContent side="right" className="w-[18rem] p-0 flex flex-col bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] border-[var(--sidebar-border)]">
           <SheetHeader className="p-0">
              {/* The UISidebarHeader will be part of sidebarNavigation */}
           </SheetHeader>
           {sidebarNavigation}
        </SheetContent>
      </Sheet>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-3">
        {/* Mobile Trigger */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSheetOpen(true)}>
          <MenuIcon />
          <span className="sr-only">فتح القائمة</span>
        </Button>
        
        <div className="flex-1">
          {/* Breadcrumbs or other header content can go here */}
        </div>

        {/* Desktop Trigger */}
        <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsDesktopSheetOpen(true)}>
          <MenuIcon />
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </header>
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // SidebarProvider might not be strictly necessary if we manage sheet state directly
  // but let's keep it for now if any sub-components rely on its context, though we simplify triggers
  return (
    <SidebarProvider defaultOpen={false}> 
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
