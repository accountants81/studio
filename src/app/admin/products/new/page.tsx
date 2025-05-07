// src/app/admin/products/new/page.tsx
"use client";

import ProductForm from "@/components/ProductForm";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddProductPage = () => {
  const { addProduct } = useProducts();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    setIsSubmitting(true);
    try {
      await addProduct(productData);
      toast({
        title: "تمت الإضافة بنجاح",
        description: `تم إضافة المنتج "${productData.name}" إلى المتجر.`,
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل إضافة المنتج. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

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
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formTitle="إضافة منتج جديد"
        submitButtonText="إضافة المنتج"
      />
    </div>
  );
};

export default AddProductPage;
