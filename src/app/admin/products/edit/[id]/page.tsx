// src/app/admin/products/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


const EditProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getProductById, editProduct, isLoading: productsLoading } = useProducts();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setInitialData(product);
      } else if (!productsLoading) {
        // Product not found, and products are loaded
        toast({
          title: "منتج غير موجود",
          description: "لم يتم العثور على المنتج المطلوب للتعديل.",
          variant: "destructive",
        });
        router.replace("/admin/products");
      }
    }
    setIsLoadingPage(productsLoading);
  }, [productId, getProductById, productsLoading, router, toast]);

  const handleSubmit = async (productData: Product) => {
    setIsSubmitting(true);
    try {
      await editProduct(productData);
      toast({
        title: "تم التعديل بنجاح",
        description: `تم تعديل المنتج "${productData.name}".`,
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تعديل المنتج. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)]" />
        <p className="ml-4 text-lg text-muted-foreground">جارِ تحميل بيانات المنتج...</p>
      </div>
    );
  }

  if (!initialData) {
    // This case should be handled by the useEffect redirect, but as a fallback:
    return <div className="text-center py-10">المنتج غير موجود.</div>;
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={() => router.back()} 
        variant="outline" 
        className="mb-6 group border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
      >
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        العودة إلى المنتجات
      </Button>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit as (productData: Omit<Product, "id"> | Product) => Promise<void>} // Cast to satisfy ProductForm prop type
        isSubmitting={isSubmitting}
        formTitle={`تعديل المنتج: ${initialData.name}`}
        submitButtonText="حفظ التعديلات"
      />
    </div>
  );
};

export default EditProductPage;
