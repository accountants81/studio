// src/app/admin/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users, BarChartBig } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext"; 

const AdminDashboardPage = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { orders, isLoading: ordersLoading } = useOrders();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCustomers = new Set(orders.map(order => order.userId || order.address.email)).size; 

  const summaryCards = [
    { title: "إجمالي المنتجات", value: productsLoading ? "جار التحميل..." : totalProducts, icon: <Package className="h-6 w-6 text-[var(--admin-primary)]" />, href: "/admin/products", color: "text-[var(--admin-primary)]" },
    { title: "إجمالي الطلبات", value: ordersLoading ? "جار التحميل..." : totalOrders, icon: <ShoppingCart className="h-6 w-6 text-green-500" />, href: "/admin/orders", color: "text-green-500" }, // Assuming green is fine or use another admin specific var
    { title: "إجمالي الإيرادات", value: ordersLoading ? "جار التحميل..." : `${totalRevenue.toFixed(2)} ج.م`, icon: <DollarSign className="h-6 w-6 text-yellow-500" />, href: "/admin/orders", color: "text-yellow-500" }, // Assuming yellow is fine
    // { title: "إجمالي العملاء", value: ordersLoading ? "جار التحميل..." : totalCustomers, icon: <Users className="h-6 w-6 text-purple-500" />, href: "/admin/customers", color: "text-purple-500" },
  ];
  
  const translateStatus = (status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "processing": return "قيد المعالجة";
      case "shipped": return "تم الشحن";
      case "delivered": return "تم التوصيل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };
  
  const statusStyles: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      shipped: "bg-sky-500/20 text-sky-400 border-sky-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">لوحة تحكم المسؤول</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">{card.title}</CardTitle>
                <span className={card.color}>{card.icon}</span>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><BarChartBig className="ml-2 text-[var(--primary)] rtl:mr-2 rtl:ml-0"/>أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? <p>جار تحميل الطلبات...</p> : orders.length > 0 ? (
              <ul className="space-y-3">
                {orders.slice(0, 5).map(order => (
                   <li key={order.id} className="flex justify-between items-center p-3 bg-[var(--muted)]/50 rounded-md">
                    <div>
                      <p className="font-medium">طلب #{order.id.substring(0,6)}</p>
                      <p className="text-sm text-muted-foreground">{order.address.fullName} - {new Date(order.orderDate).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-semibold text-[var(--primary)]">{order.totalAmount.toFixed(2)} ج.م</p>
                       <span className={`px-2 py-1 text-xs rounded-full border ${statusStyles[order.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          {translateStatus(order.status)}
                        </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">لا توجد طلبات حديثة.</p>
            )}
             {orders.length > 5 && (
                <Link href="/admin/orders" className="text-sm text-[var(--primary)] hover:underline mt-4 block text-center">
                  عرض جميع الطلبات
                </Link>
              )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]">
           <CardHeader>
            <CardTitle className="text-xl flex items-center"><Package className="ml-2 text-[var(--primary)] rtl:mr-2 rtl:ml-0"/>أحدث المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
             {productsLoading ? <p>جار تحميل المنتجات...</p> : products.length > 0 ? (
              <ul className="space-y-3">
                {products.slice(0, 5).map(product => (
                  <li key={product.id} className="flex justify-between items-center p-3 bg-[var(--muted)]/50 rounded-md">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="font-semibold text-[var(--primary)]">{product.price.toFixed(2)} ج.م</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">لا توجد منتجات مضافة حديثاً.</p>
            )}
            {products.length > 5 && (
              <Link href="/admin/products" className="text-sm text-[var(--primary)] hover:underline mt-4 block text-center">
                عرض جميع المنتجات
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
