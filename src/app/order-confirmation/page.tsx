// src/app/order-confirmation/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OrderConfirmationPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <Card className="w-full max-w-lg shadow-xl p-6 md:p-10">
        <CardHeader className="items-center">
          <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
            تم تأكيد طلبك بنجاح!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            شكراً لثقتك بنا. سيتم تجهيز طلبك وشحنه في أقرب وقت.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <p className="text-md text-foreground/80">
            ستتلقى رسالة تأكيد عبر البريد الإلكتروني (إذا تم توفيره) تحتوي على تفاصيل طلبك.
            يمكنك متابعة حالة طلبك من خلال صفحة <Link href="/orders/history" className="text-primary hover:underline font-medium">طلباتي</Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link href="/products">
                <ShoppingBag className="ml-2 h-5 w-5 transition-transform group-hover:scale-110 rtl:mr-2 rtl:ml-0" />
                متابعة التسوق
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                العودة إلى الرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;

