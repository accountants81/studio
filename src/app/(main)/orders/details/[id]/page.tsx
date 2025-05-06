// src/app/(main)/orders/details/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, User, MapPin, Phone, Mail, ShoppingBag, CreditCard, CalendarDays, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const UserOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { getOrderById, isLoading: ordersLoading } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/orders/details/${orderId}`);
      return;
    }

    if (orderId && user) {
      const fetchedOrder = getOrderById(orderId);
      if (fetchedOrder) {
        // Ensure the order belongs to the current user
        if (fetchedOrder.userId === user.id || fetchedOrder.address.email === user.email) { // Added email check for guest orders if email was captured
            setOrder(fetchedOrder);
        } else {
             toast({ title: "غير مصرح به", description: "لا يمكنك عرض هذا الطلب.", variant: "destructive" });
             router.replace("/orders/history");
        }
      } else if (!ordersLoading) {
        // Order not found and orders are loaded
        toast({ title: "طلب غير موجود", description: "لم يتم العثور على الطلب المطلوب.", variant: "destructive" });
        router.replace("/orders/history");
      }
      setIsLoadingPage(ordersLoading || authLoading);
    }
  }, [orderId, getOrderById, ordersLoading, user, authLoading, router]);

  const translateStatus = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "processing": return "قيد المعالجة";
      case "shipped": return "تم الشحن";
      case "delivered": return "تم التوصيل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  const statusColors: Record<Order["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
    shipped: "bg-sky-100 text-sky-800 border-sky-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };


  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">جارِ تحميل تفاصيل طلبك...</p>
      </div>
    );
  }

  if (!order) {
    // This case should be handled by useEffect redirect, but as a fallback:
    return <div className="text-center py-10">الطلب غير موجود أو ليس لديك صلاحية لعرضه.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-6 group">
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        العودة إلى سجل الطلبات
      </Button>
      
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">تفاصيل الطلب #{order.id.substring(0,8)}...</CardTitle>
              <CardDescription className="text-md mt-1">
                <CalendarDays className="inline ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/>
                تاريخ الطلب: {new Date(order.orderDate).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
              </CardDescription>
            </div>
            <Badge variant="outline" className={cn("text-lg px-4 py-2 mt-2 sm:mt-0", statusColors[order.status])}>
              {translateStatus(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Shipping Information */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center mb-2"><MapPin className="ml-2 h-6 w-6 text-primary rtl:mr-2 rtl:ml-0"/>عنوان الشحن</h3>
              <p><User className="inline ml-1 h-4 w-4 text-muted-foreground rtl:mr-1 rtl:ml-0"/><strong>المستلم:</strong> {order.address.fullName}</p>
              <p><Phone className="inline ml-1 h-4 w-4 text-muted-foreground rtl:mr-1 rtl:ml-0"/><strong>الهاتف:</strong> <span dir="ltr">{order.address.phone}</span></p>
              {order.address.alternativePhone && <p><Phone className="inline ml-1 h-4 w-4 text-muted-foreground rtl:mr-1 rtl:ml-0"/><strong>هاتف بديل:</strong> <span dir="ltr">{order.address.alternativePhone}</span></p>}
              <p><MapPin className="inline ml-1 h-4 w-4 text-muted-foreground rtl:mr-1 rtl:ml-0"/><strong>المحافظة:</strong> {order.address.governorate}</p>
              <p className="leading-relaxed"><strong>العنوان:</strong> {order.address.addressLine}</p>
              {order.address.distinctiveMark && <p><strong>علامة مميزة:</strong> {order.address.distinctiveMark}</p>}
              {order.address.email && <p><Mail className="inline ml-1 h-4 w-4 text-muted-foreground rtl:mr-1 rtl:ml-0"/><strong>البريد الإلكتروني:</strong> {order.address.email}</p>}
            </div>

            {/* Payment Information */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center mb-2"><CreditCard className="ml-2 h-6 w-6 text-primary rtl:mr-2 rtl:ml-0"/>معلومات الدفع</h3>
              <p><strong>طريقة الدفع:</strong> {
                order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' :
                order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' :
                order.paymentMethod === 'fawry' ? 'فوري' : 'غير محدد'
              }</p>
              <Separator className="my-3"/>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">إجمالي المنتجات:</span>
                <span className="font-medium">{(order.totalAmount - order.shippingCost).toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">رسوم الشحن:</span>
                <span className="font-medium">{order.shippingCost.toFixed(2)} ج.م</span>
              </div>
              <Separator className="my-3"/>
              <div className="flex justify-between items-center text-xl">
                <span className="font-semibold">المجموع الكلي:</span>
                <span className="font-bold text-primary">{order.totalAmount.toFixed(2)} ج.م</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-6"/>

          {/* Order Items */}
          <div>
            <h3 className="text-xl font-semibold flex items-center mb-4"><ShoppingBag className="ml-2 h-6 w-6 text-primary rtl:mr-2 rtl:ml-0"/>المنتجات في هذا الطلب</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.images[0] || "https://picsum.photos/seed/orderdetailitem/150"}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="product ordered image"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-right">
                    <Link href={`/products/${item.id}`} className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <Tag className="inline ml-1 h-3 w-3 rtl:mr-1 rtl:ml-0"/>
                      السعر الفردي: {item.price.toFixed(2)} ج.م
                    </p>
                  </div>
                  <div className="text-md font-semibold text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0">
                    <p>الكمية: {item.quantity}</p>
                    <p>الإجمالي: {(item.quantity * item.price).toFixed(2)} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
// Placeholder for toast function if not globally available or imported
const toast = (options: { title: string, description: string, variant?: "destructive" | "default" }) => {
  console.log(`Toast: ${options.title} - ${options.description}`);
};


export default UserOrderDetailPage;
