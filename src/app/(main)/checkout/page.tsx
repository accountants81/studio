// src/app/(main)/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { EGYPTIAN_GOVERNORATES, MIN_ORDER_VALUE } from "@/lib/constants";
import type { OrderAddress, PaymentMethod } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Home, Phone, Truck, UserCircle, Mail, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import { getShippingDetails as mockGetShippingDetails } from '@/services/egypt-shipping';

const addressSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب (3 أحرف على الأقل)"),
  phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف مصري صالح مطلوب (مثال: 01xxxxxxxxx)"),
  alternativePhone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف بديل مصري صالح مطلوب").optional().or(z.literal('')),
  governorate: z.string().min(1, "يرجى اختيار المحافظة"),
  addressLine: z.string().min(10, "العنوان التفصيلي مطلوب (10 أحرف على الأقل)"),
  distinctiveMark: z.string().optional(),
  email: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal('')),
  paymentMethod: z.enum(["vodafone_cash", "fawry", "cash_on_delivery"], {
    required_error: "يرجى اختيار طريقة الدفع",
  }),
});

type AddressFormData = z.infer<typeof addressSchema>;

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart, isMinOrderValueMet } = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const [shippingCost, setShippingCost] = useState(0);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      alternativePhone: "",
      distinctiveMark: "",
      paymentMethod: "cash_on_delivery",
    },
  });

  const selectedGovernorateName = form.watch("governorate");

  useEffect(() => {
    if (!isMinOrderValueMet || cartItems.length === 0) {
      toast({
        title: "السلة لا تستوفي الشروط",
        description: `الحد الأدنى للطلب هو ${MIN_ORDER_VALUE} ج.م أو السلة فارغة.`,
        variant: "destructive",
      });
      router.push("/cart");
    }
  }, [isMinOrderValueMet, cartItems, router, toast]);
  
  useEffect(() => {
    const governorateData = EGYPTIAN_GOVERNORATES.find(g => g.name === selectedGovernorateName);
    if (governorateData) {
      setShippingCost(governorateData.shippingCost);
    } else {
      // Fallback or default shipping cost if governorate not found or not selected
      // This might be a good place to use the mockGetShippingDetails if needed
      // For now, set to a default or keep as is if a default is set earlier
      setShippingCost(EGYPTIAN_GOVERNORATES.find(g => g.id === 'cairo')?.shippingCost || 50); // Default to Cairo if nothing selected
    }
  }, [selectedGovernorateName]);


  const cartTotal = getCartTotal();
  const orderTotal = cartTotal + shippingCost;

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    if (!isMinOrderValueMet) {
      toast({ title: "خطأ", description: `الحد الأدنى للطلب هو ${MIN_ORDER_VALUE} ج.م`, variant: "destructive" });
      return;
    }

    const orderData: OrderAddress = {
      fullName: data.fullName,
      phone: data.phone,
      alternativePhone: data.alternativePhone,
      governorate: data.governorate,
      addressLine: data.addressLine,
      distinctiveMark: data.distinctiveMark,
      email: data.email,
    };

    try {
      await addOrder({
        items: cartItems,
        address: orderData,
        paymentMethod: data.paymentMethod as PaymentMethod,
        totalAmount: orderTotal,
        shippingCost: shippingCost,
        userId: user?.id,
      });

      toast({
        title: "تم تأكيد الطلب بنجاح!",
        description: "شكراً لطلبك. ستتلقى تفاصيل الطلب قريباً.",
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/orders/history')}>
            عرض طلباتي
          </Button>
        )
      });
      clearCart();
      router.push("/order-confirmation"); // Or a specific order success page
    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "خطأ في الطلب",
        description: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  if (cartItems.length === 0 && !form.formState.isSubmitting) {
     // Handled by useEffect redirect, but good to have a fallback UI
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">سلتك فارغة</h1>
        <p className="text-muted-foreground mt-2 mb-4">لا يمكنك المتابعة للدفع بسلة فارغة.</p>
        <Button asChild>
          <Link href="/products">العودة للمنتجات</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-6 group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        العودة إلى السلة
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary flex items-center">
        <CreditCard className="ml-3 h-10 w-10 rtl:mr-3 rtl:ml-0" />
        إتمام عملية الشراء
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center"><UserCircle className="ml-2 h-7 w-7 text-primary rtl:mr-2 rtl:ml-0" /> معلومات الشحن</CardTitle>
                <CardDescription>أدخل تفاصيل عنوان الشحن الخاص بك.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="ادخل اسمك الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="01xxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternativePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم هاتف بديل (اختياري)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="01xxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="governorate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المحافظة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر محافظتك" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EGYPTIAN_GOVERNORATES.map((gov) => (
                            <SelectItem key={gov.id} value={gov.name}>
                              {gov.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان التفصيلي</FormLabel>
                      <FormControl>
                        <Textarea placeholder="مثال: ١٢٣ شارع النصر، بجوار مسجد السلام، الدور الثالث، شقة ٥" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distinctiveMark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>علامة مميزة للعنوان (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: بالقرب من سوبر ماركت المدينة" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني (اختياري)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="لتلقي تحديثات الطلب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center"><Truck className="ml-2 h-7 w-7 text-primary rtl:mr-2 rtl:ml-0" /> طريقة الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value="cash_on_delivery" />
                            </FormControl>
                            <FormLabel className="font-normal text-md">
                              الدفع عند الاستلام
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value="vodafone_cash" />
                            </FormControl>
                            <FormLabel className="font-normal text-md">
                              فودافون كاش (سيتم التواصل معك للتأكيد)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value="fawry" />
                            </FormControl>
                            <FormLabel className="font-normal text-md">
                              فوري (سيتم التواصل معك للتأكيد)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full text-lg py-3 group" disabled={form.formState.isSubmitting || !isMinOrderValueMet}>
              {form.formState.isSubmitting ? "جارِ تأكيد الطلب..." : (
                <>
                  تأكيد الطلب <CheckCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 rtl:ml-2 rtl:mr-0" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name} (x{item.quantity})</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <p>{(item.price * item.quantity).toFixed(2)} ج.م</p>
                </div>
              ))}
              <Separator className="my-3"/>
              <div className="flex justify-between text-md">
                <span>الإجمالي الفرعي للمنتجات:</span>
                <span>{cartTotal.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between text-md">
                <span>رسوم الشحن ({selectedGovernorateName || "اختر محافظة"}):</span>
                <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} ج.م` : "يُحسب"}</span>
              </div>
              <Separator className="my-3"/>
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>المجموع الكلي:</span>
                <span>{orderTotal.toFixed(2)} ج.م</span>
              </div>
            </CardContent>
             <CardFooter>
                 {!isMinOrderValueMet && (
                    <p className="text-destructive text-sm text-center w-full">الحد الأدنى للطلب هو {MIN_ORDER_VALUE} ج.م. لا يمكنك إكمال الطلب.</p>
                )}
             </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
