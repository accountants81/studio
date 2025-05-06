// src/components/ProductForm.tsx
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types";
import Image from "next/image";
import { UploadCloud, Trash2, PlusCircle, PackageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (productData: Omit<Product, "id"> | Product) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle: string;
}

const ProductForm = ({ initialData, onSubmit, isSubmitting, submitButtonText = "حفظ المنتج", formTitle }: ProductFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [category, setCategory] = useState(initialData?.category || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []); // Store as base64 or URLs
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setCategory(initialData.category);
      setImages(initialData.images || []);
    }
  }, [initialData]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles(prevFiles => [...prevFiles, ...filesArray]);

      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prevImages => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      // Clear the input value to allow selecting the same file again if removed
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    // Note: For simplicity, this doesn't remove from imageFiles if it was just added.
    // A more robust solution would track files and their base64 representations.
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (images.length === 0) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى إضافة صورة واحدة على الأقل للمنتج.",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      images, // Send base64 strings or URLs
    };

    if (initialData?.id) {
      await onSubmit({ ...productData, id: initialData.id });
    } else {
      await onSubmit(productData);
    }
  };

  const availableCategories = ["جرابات", "واقيات شاشة", "شواحن", "كوابل", "إكسسوارات صوت", "حوامل", "أخرى"];

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl flex items-center">
          <PackageIcon className="ml-3 h-8 w-8 text-primary rtl:mr-3 rtl:ml-0" />
          {formTitle}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنتج</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="مثال: جراب سيليكون لآيفون 15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">السعر (ج.م)</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min="0" step="0.01" placeholder="مثال: 250.00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">الفئة</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>اختر فئة...</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المنتج</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} placeholder="وصف تفصيلي للمنتج، مميزاته، المواد المصنوع منها، إلخ." />
          </div>

          <div className="space-y-2">
            <Label>صور المنتج</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((imageSrc, index) => (
                <div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
                  <Image src={imageSrc} alt={`صورة المنتج ${index + 1}`} layout="fill" objectFit="cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Label
                htmlFor="imageUpload"
                className="aspect-square border-2 border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <UploadCloud size={32} className="text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center">إضافة صورة</span>
              </Label>
            </div>
            <Input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            <p className="text-xs text-muted-foreground mt-1">يمكنك إضافة صور متعددة. الصورة الأولى ستكون الرئيسية.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto text-lg py-3 group">
            {isSubmitting ? "جارِ الحفظ..." : (
              <>
                {submitButtonText}
                <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 rtl:ml-2 rtl:mr-0" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
