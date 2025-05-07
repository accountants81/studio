// src/app/(main)/orders/history/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, ListOrdered, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const OrderHistoryPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { getUserOrders, isLoading: ordersLoading } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/orders/history");
    }
  }, [user, authLoading, router]);

  if (authLoading || ordersLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">جارِ تحميل سجل الطلبات...</div>;
  }

  if (!user) {
     // Should be redirected by useEffect, but good fallback
    return <div className="container mx-auto px-4 py-8 text-center">يرجى تسجيل الدخول لعرض طلباتك.</div>;
  }
  
  const userOrders = getUserOrders();

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

  const statusColors: Record<"pending" | "processing" | "shipped" | "delivered" | "cancelled", string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    processing: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    shipped: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
    delivered: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    cancelled: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary flex items-center">
        <ListOrdered className="ml-3 h-10 w-10 rtl:mr-3 rtl:ml-0" />
        سجل طلباتي
      </h1>

      {userOrders.length === 0 ? (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">لا توجد طلبات حتى الآن!</h2>
            <p className="text-muted-foreground mb-6">
              لم تقم بأي طلبات بعد. ابدأ التسوق الآن!
            </p>
            <Button asChild size="lg">
              <Link href="/products">تصفح المنتجات</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>قائمة طلباتك</CardTitle>
            <CardDescription>هنا يمكنك العثور على جميع طلباتك السابقة وحالتها الحالية.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">رقم الطلب</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-center">الإجمالي (ج.م)</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50 dark:hover:bg-muted/20">
                    <TableCell className="font-mono text-xs">{order.id.substring(0,12)}...</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                    <TableCell className="text-center font-semibold">{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("text-xs px-2 py-1", statusColors[order.status])}>
                        {translateStatus(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button asChild variant="outline" size="sm" className="group">
                        <Link href={`/orders/details/${order.id}`}>
                          <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
                           <span className="sr-only md:not-sr-only md:ml-1 rtl:md:mr-1 rtl:md:ml-0">عرض التفاصيل</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderHistoryPage;
