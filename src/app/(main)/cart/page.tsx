// src/app/(main)/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { MIN_ORDER_VALUE } from "@/lib/constants";
import { Trash2, PlusCircle, MinusCircle, ShoppingBag, ArrowLeft, XCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, isMinOrderValueMet, isLoading } = useCart();

  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount(); // This returns total quantity of items, not unique items.

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">جارِ تحميل السلة...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center">
          <ShoppingBag className="ml-3 h-10 w-10 rtl:mr-3 rtl:ml-0" />
          سلة التسوق الخاصة بك
        </h1>
        {cartItems.length > 0 && (
          <Button variant="outline" onClick={() => cartItems.forEach(item => removeFromCart(item.id))} className="text-destructive hover:text-destructive/80 group">
            <XCircle className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 transition-transform group-hover:scale-110" />
            إفراغ السلة
          </Button>
        )}
      </div>


      {cartItems.length === 0 ? (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">سلتك فارغة!</h2>
            <p className="text-muted-foreground mb-6">
              لا توجد منتجات في سلة التسوق الخاصة بك حتى الآن. ابدأ التسوق!
            </p>
            <Button asChild size="lg" className="group">
              <Link href="/products">
                تصفح المنتجات <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 rtl:mr-0 rtl:ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md overflow-hidden">
                <div className="w-24 h-24 sm:w-32 sm:h-32 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={(item.images && item.images.length > 0 ? item.images[0] : "https://picsum.photos/200")}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="product in cart"
                  />
                </div>
                <div className="flex-grow text-center sm:text-right rtl:sm:text-left">
                  <Link href={`/products/${item.id}`}>
                    <h2 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-md font-semibold text-primary mt-1">{item.price.toFixed(2)} ج.م</p>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse my-2 sm:my-0">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <MinusCircle className="h-5 w-5" />
                     <span className="sr-only">تقليل الكمية</span>
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                            updateQuantity(item.id, val)
                        } else if (e.target.value === "") {
                            // Allow empty input for user to type, but don't update to 0 or NaN
                        }
                    }}
                    onBlur={(e) => { // Ensure quantity is at least 1 on blur
                        const val = parseInt(e.target.value);
                        if (isNaN(val) || val < 1) {
                           updateQuantity(item.id, 1); // Reset to 1 if invalid
                        }
                    }}
                    min="1"
                    className="w-16 h-10 text-center"
                    aria-label={`كمية ${item.name}`}
                  />
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <PlusCircle className="h-5 w-5" />
                    <span className="sr-only">زيادة الكمية</span>
                  </Button>
                </div>
                <div className="text-md font-semibold w-32 text-center">
                  الإجمالي: {(item.price * item.quantity).toFixed(2)} ج.م
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">إزالة المنتج</span>
                </Button>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-md">
                  <span>عدد أنواع المنتجات:</span>
                  <span>{cartItems.length}</span>
                </div>
                 <div className="flex justify-between text-md">
                  <span>إجمالي عدد القطع:</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex justify-between text-md">
                  <span>الإجمالي الفرعي:</span>
                  <span>{cartTotal.toFixed(2)} ج.م</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>المجموع الكلي:</span>
                  <span>{cartTotal.toFixed(2)} ج.م</span>
                </div>
                {!isMinOrderValueMet && cartItems.length > 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>تنبيه!</AlertTitle>
                    <AlertDescription>
                      الحد الأدنى للطلب هو {MIN_ORDER_VALUE} ج.م. يرجى إضافة المزيد من المنتجات للمتابعة.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full text-lg group" disabled={!isMinOrderValueMet || cartItems.length === 0}>
                  <Link href="/checkout">
                    متابعة إلى الدفع <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 rtl:mr-0 rtl:ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
