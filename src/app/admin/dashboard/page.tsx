// src/app/admin/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users, BarChartBig } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext"; // Assuming you have an OrderContext

const AdminDashboardPage = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { orders, isLoading: ordersLoading } = useOrders();

  // Placeholder data - replace with actual data fetching and calculations
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCustomers = new Set(orders.map(order => order.userId || order.address.email)).size; // Approximate

  const summaryCards = [
    { title: "إجمالي المنتجات", value: productsLoading ? "جار التحميل..." : totalProducts, icon: <Package className="h-6 w-6 text-primary" />, href: "/admin/products", color: "text-blue-500" },
    { title: "إجمالي الطلبات", value: ordersLoading ? "جار التحميل..." : totalOrders, icon: <ShoppingCart className="h-6 w-6 text-green-500" />, href: "/admin/orders", color: "text-green-500" },
    { title: "إجمالي الإيرادات", value: ordersLoading ? "جار التحميل..." : `${totalRevenue.toFixed(2)} ج.م`, icon: <DollarSign className="h-6 w-6 text-yellow-500" />, href: "/admin/orders", color: "text-yellow-500" },
    // { title: "إجمالي العملاء", value: ordersLoading ? "جار التحميل..." : totalCustomers, icon: <Users className="h-6 w-6 text-purple-500" />, href: "/admin/customers", color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">لوحة تحكم المسؤول</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">{card.title}</CardTitle>
                <span className={card.color}>{card.icon}</span>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                {/* <p className="text-xs text-muted-foreground">+20.1% من الشهر الماضي</p> */}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><BarChartBig className="ml-2 text-primary rtl:mr-2 rtl:ml-0"/>أحدث الطلبات (مثال)</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? <p>جار تحميل الطلبات...</p> : orders.length > 0 ? (
              <ul className="space-y-3">
                {orders.slice(0, 5).map(order => (
                   <li key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">طلب #{order.id.substring(0,6)}</p>
                      <p className="text-sm text-muted-foreground">{order.address.fullName} - {new Date(order.orderDate).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-semibold text-primary">{order.totalAmount.toFixed(2)} ج.م</p>
                       <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          order.status === 'delivered' ? 'bg-green-200 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-200 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {order.status === 'pending' ? 'قيد الانتظار' : 
                           order.status === 'delivered' ? 'تم التوصيل' : 
                           order.status === 'shipped' ? 'تم الشحن' :
                           order.status === 'processing' ? 'قيد المعالجة' :
                           'ملغي'}
                        </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">لا توجد طلبات حديثة.</p>
            )}
             {orders.length > 5 && (
                <Link href="/admin/orders" className="text-sm text-primary hover:underline mt-4 block text-center">
                  عرض جميع الطلبات
                </Link>
              )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="text-xl flex items-center"><Package className="ml-2 text-primary rtl:mr-2 rtl:ml-0"/>أحدث المنتجات (مثال)</CardTitle>
          </CardHeader>
          <CardContent>
             {productsLoading ? <p>جار تحميل المنتجات...</p> : products.length > 0 ? (
              <ul className="space-y-3">
                {products.slice(0, 5).map(product => (
                  <li key={product.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="font-semibold text-primary">{product.price.toFixed(2)} ج.م</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">لا توجد منتجات مضافة حديثاً.</p>
            )}
            {products.length > 5 && (
              <Link href="/admin/products" className="text-sm text-primary hover:underline mt-4 block text-center">
                عرض جميع المنتجات
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Add more sections like charts, recent activities etc. */}
    </div>
  );
};

export default AdminDashboardPage;
