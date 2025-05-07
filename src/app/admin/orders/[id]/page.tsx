// src/app/admin/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/contexts/OrderContext";
import type { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, User, MapPin, Phone, Mail, ShoppingBag, Truck, CreditCard, Tag, Edit2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getOrderById, updateOrderStatus, isLoading: ordersLoading } = useOrders();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      const fetchedOrder = getOrderById(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      } else if (!ordersLoading) {
        toast({
          title: "طلب غير موجود",
          description: "لم يتم العثور على الطلب المطلوب.",
          variant: "destructive",
        });
        router.replace("/admin/orders");
      }
    }
    setIsLoadingPage(ordersLoading);
  }, [orderId, getOrderById, ordersLoading, router, toast]);

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return;
    setIsUpdatingStatus(true);
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      if (updatedOrder) {
        setOrder(updatedOrder);
        toast({
          title: "تم تحديث الحالة",
          description: `تم تحديث حالة الطلب إلى "${translateStatus(newStatus)}".`,
        });
      } else {
         throw new Error("Failed to update order status from context");
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الطلب.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
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
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    shipped: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)]" />
        <p className="ml-4 text-lg text-muted-foreground">جارِ تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-10">الطلب غير موجود.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <Button onClick={() => router.back()} variant="outline" className="mb-2 group sm:mb-0 border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                العودة إلى الطلبات
            </Button>
            <h1 className="text-3xl font-bold text-foreground mt-2">تفاصيل الطلب #{order.id.substring(0,8)}...</h1>
            <p className="text-muted-foreground">
                تاريخ الطلب: {new Date(order.orderDate).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
        </div>
        <div className="w-full sm:w-auto">
          <Label htmlFor="status" className="text-sm font-medium text-muted-foreground">تغيير حالة الطلب:</Label>
          <Select
            value={order.status}
            onValueChange={(newStatus) => handleStatusChange(newStatus as Order["status"])}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className={cn("h-10 w-full sm:w-[180px] font-semibold", statusColors[order.status])}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--popover)] text-[var(--popover-foreground)]">
              {(["pending", "processing", "shipped", "delivered", "cancelled"] as Order["status"][]).map(s => (
                <SelectItem key={s} value={s} className={cn("text-sm cursor-pointer hover:!bg-[var(--accent)]", statusColors[s])}>
                  {isUpdatingStatus && order.status === s ? "جارِ التحديث..." : translateStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer and Shipping Info */}
        <Card className="md:col-span-2 shadow-lg bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><User className="ml-2 h-6 w-6 text-[var(--primary)] rtl:mr-2 rtl:ml-0"/>معلومات العميل والشحن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><strong>الاسم:</strong> {order.address.fullName}</div>
              <div><Phone className="inline ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/><strong>الهاتف:</strong> <span dir="ltr">{order.address.phone}</span></div>
              {order.address.alternativePhone && <div><Phone className="inline ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/><strong>هاتف بديل:</strong> <span dir="ltr">{order.address.alternativePhone}</span></div>}
              {order.address.email && <div><Mail className="inline ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/><strong>البريد الإلكتروني:</strong> {order.address.email}</div>}
            </div>
            <Separator className="bg-[var(--border)]"/>
            <div><MapPin className="inline ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/><strong>المحافظة:</strong> {order.address.governorate}</div>
            <div><Home className="inline ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/><strong>العنوان التفصيلي:</strong> {order.address.addressLine}</div>
            {order.address.distinctiveMark && <div><strong>علامة مميزة:</strong> {order.address.distinctiveMark}</div>}
          </CardContent>
        </Card>

        {/* Payment and Totals */}
        <Card className="shadow-lg bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><CreditCard className="ml-2 h-6 w-6 text-[var(--primary)] rtl:mr-2 rtl:ml-0"/>تفاصيل الدفع والطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><strong>طريقة الدفع:</strong> {
              order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' :
              order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' :
              order.paymentMethod === 'fawry' ? 'فوري' : 'غير محدد'
            }</div>
            <Separator className="bg-[var(--border)]"/>
            <div className="flex justify-between"><span>إجمالي المنتجات:</span> <span>{(order.totalAmount - order.shippingCost).toFixed(2)} ج.م</span></div>
            <div className="flex justify-between"><span>رسوم الشحن:</span> <span>{order.shippingCost.toFixed(2)} ج.م</span></div>
            <Separator className="bg-[var(--border)]"/>
            <div className="flex justify-between font-bold text-lg text-[var(--primary)]"><span>المجموع الكلي:</span> <span>{order.totalAmount.toFixed(2)} ج.م</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="shadow-lg bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><ShoppingBag className="ml-2 h-6 w-6 text-[var(--primary)] rtl:mr-2 rtl:ml-0"/>المنتجات المطلوبة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-md bg-[var(--muted)]/50 border-[var(--border)]">
                <Image
                  src={item.images[0] || "https://picsum.photos/seed/orderitem/100"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover aspect-square border border-[var(--border)]"
                  data-ai-hint="product order item"
                />
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-sm text-right">
                  <p>{item.quantity} x {item.price.toFixed(2)} ج.م</p>
                  <p className="font-semibold">{(item.quantity * item.price).toFixed(2)} ج.م</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetailPage;
