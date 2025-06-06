// src/app/admin/orders/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, ListOrdered, Search, PackageOpen } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import type { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AdminOrdersPage = () => {
  const { getAllOrders, updateOrderStatus, isLoading } = useOrders();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "all">("all");

  const orders = getAllOrders();

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "تم تحديث الحالة",
        description: `تم تحديث حالة الطلب #${orderId.substring(0,6)} إلى "${translateStatus(newStatus)}".`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الطلب.",
        variant: "destructive",
      });
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
  
  const orderStatuses: (Order["status"] | "all")[] = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];


  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.phone.includes(searchTerm) ||
      (order.address.email && order.address.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <ListOrdered className="ml-3 h-8 w-8 text-[var(--primary)] rtl:mr-3 rtl:ml-0" />
          إدارة الطلبات
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-grow md:flex-grow-0">
            <Input 
              type="search"
              placeholder="ابحث بالرقم, الاسم, الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 w-full md:w-64 bg-[var(--input)] text-foreground border-[var(--border)] focus:ring-[var(--ring)]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
          </div>
           <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Order["status"] | "all")}>
            <SelectTrigger className="w-full md:w-[180px] h-10 bg-[var(--input)] text-foreground border-[var(--border)] focus:ring-[var(--ring)]">
              <SelectValue placeholder="فلترة بالحالة" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--popover)] text-[var(--popover-foreground)] border-[var(--border)]">
              {orderStatuses.map(status => (
                <SelectItem key={status} value={status} className="cursor-pointer hover:!bg-[var(--accent)]">
                  {status === "all" ? "كل الحالات" : translateStatus(status as Order["status"])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">جارِ تحميل الطلبات...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-[var(--card)] rounded-lg shadow border border-[var(--border)]">
            <PackageOpen className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
             <h2 className="text-2xl font-semibold text-foreground mb-2">
              {searchTerm || filterStatus !== "all" ? "لم يتم العثور على طلبات" : "لا توجد طلبات بعد"}
            </h2>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all" ? "جرّب تعديل بحثك أو الفلتر." : "عندما يتم إجراء طلبات جديدة، ستظهر هنا."}
            </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[var(--card)] rounded-lg shadow border border-[var(--border)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[var(--border)]">
                <TableHead className="w-[100px] text-muted-foreground">رقم الطلب</TableHead>
                <TableHead className="text-muted-foreground">العميل</TableHead>
                <TableHead className="text-muted-foreground">التاريخ</TableHead>
                <TableHead className="text-center text-muted-foreground">الإجمالي (ج.م)</TableHead>
                <TableHead className="text-center text-muted-foreground">الحالة</TableHead>
                <TableHead className="text-center text-muted-foreground">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[var(--muted)]/50 border-b-[var(--border)] last:border-b-0">
                  <TableCell className="font-mono text-xs">{order.id.substring(0, 12)}...</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.address.fullName}</div>
                    <div className="text-xs text-muted-foreground">{order.address.phone}</div>
                  </TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                  <TableCell className="text-center font-semibold">{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => handleStatusChange(order.id, newStatus as Order["status"])}
                    >
                      <SelectTrigger className={cn("text-xs h-8 w-[120px] mx-auto border-0 focus:ring-0 font-semibold", statusColors[order.status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--popover)] text-[var(--popover-foreground)]">
                        {(["pending", "processing", "shipped", "delivered", "cancelled"] as Order["status"][]).map(s => (
                          <SelectItem key={s} value={s} className={cn("text-xs cursor-pointer hover:!bg-[var(--accent)]", statusColors[s])}>
                            {translateStatus(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button asChild variant="outline" size="sm" className="group border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="sr-only md:not-sr-only md:ml-1 rtl:md:mr-1 rtl:md:ml-0">عرض</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
