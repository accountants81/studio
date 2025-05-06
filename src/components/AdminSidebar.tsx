// src/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, Users, BarChart3, LogOut, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
}

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={20} /> },
    { 
      href: "/admin/products", 
      label: "المنتجات", 
      icon: <Package size={20} />,
      subItems: [
        { href: "/admin/products", label: "كل المنتجات", icon: <Package size={18} /> },
        { href: "/admin/products/new", label: "إضافة منتج جديد", icon: <PlusCircle size={18} /> },
      ]
    },
    { href: "/admin/orders", label: "الطلبات", icon: <ShoppingCart size={20} /> },
    // { href: "/admin/customers", label: "العملاء", icon: <Users size={20} /> },
    // { href: "/admin/reports", label: "التقارير", icon: <BarChart3 size={20} /> },
    // { href: "/admin/settings", label: "الإعدادات", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-card border-l border-border/60 flex flex-col h-screen sticky top-0 shadow-lg rtl:border-r rtl:border-l-0">
      <div className="p-6 border-b border-border/60 text-center">
        <Link href="/admin/dashboard">
          <h2 className="text-2xl font-bold text-primary">{SITE_NAME} - لوحة التحكم</h2>
        </Link>
      </div>
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
          {navItems.map((item) =>
            item.subItems ? (
              <AccordionItem key={item.label} value={item.label} className="border-b-0">
                <AccordionTrigger
                   className={cn(
                    "flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors",
                    pathname.startsWith(item.href) && "bg-muted text-primary font-semibold"
                  )}
                >
                    <div className="flex items-center">
                        <span className="ml-3 rtl:mr-3 rtl:ml-0">{item.icon}</span>
                        {item.label}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <ul className="space-y-1 mr-4 rtl:ml-4 rtl:mr-0 border-r-2 border-primary/30 pr-3 rtl:border-l-2 rtl:border-r-0 rtl:pl-3">
                    {item.subItems.map(subItem => (
                       <li key={subItem.label}>
                        <Link href={subItem.href}>
                          <span
                            className={cn(
                              "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-muted/80 hover:text-primary transition-colors",
                              pathname === subItem.href ? "bg-muted/80 text-primary font-semibold" : "text-foreground/80"
                            )}
                          >
                            <span className="ml-3 rtl:mr-3 rtl:ml-0">{subItem.icon}</span>
                            {subItem.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors",
                    pathname === item.href ? "bg-muted text-primary font-semibold" : "text-foreground/90"
                  )}
                >
                  <span className="ml-3 rtl:mr-3 rtl:ml-0">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            )
          )}
        </Accordion>
      </nav>
      <div className="p-4 mt-auto border-t border-border/60">
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80" onClick={logout}>
          <LogOut size={20} className="ml-3 rtl:mr-3 rtl:ml-0" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
