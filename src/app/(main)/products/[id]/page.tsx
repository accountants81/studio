// src/app/(main)/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added import
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/types";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart, Tag, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getProductById, isLoading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      const fetchedProduct = getProductById(params.id as string);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else if (!productsLoading) {
        // If product not found and not loading, redirect or show not found
        // For now, let's log and handle in UI
        console.warn(`Product with id ${params.id} not found.`);
      }
    }
  }, [params.id, getProductById, productsLoading]);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="w-full aspect-square bg-muted animate-pulse rounded-lg"></div>
            <div className="flex gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-1/2 bg-muted animate-pulse rounded"></div>
            <div className="h-20 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-12 w-1/3 bg-muted animate-pulse rounded"></div>
            <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">المنتج غير موجود</h1>
        <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
        <Button onClick={() => router.push("/products")} variant="outline">
          <ArrowRight className="ml-2 h-4 w-4" /> العودة إلى المنتجات
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `${product.name} (x${quantity}) أضيف إلى سلة التسوق.`,
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-6 group">
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        العودة
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          {/* Image Gallery */}
          <div className="p-4 md:p-6">
            <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg overflow-hidden shadow-inner mb-4">
              <Image
                src={product.images[selectedImageIndex] || "https://picsum.photos/seed/productdetail/600"}
                alt={`${product.name} - صورة ${selectedImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-300 ease-in-out hover:opacity-90"
                data-ai-hint="product image large"
              />
            </AspectRatio>
            {product.images.length > 1 && (
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="icon" onClick={prevImage} aria-label="الصورة السابقة">
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                </Button>
                {product.images.map((imgSrc, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all
                                ${index === selectedImageIndex ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/70'}`}
                  >
                    <Image
                      src={imgSrc || "https://picsum.photos/seed/thumbnail/100"}
                      alt={`${product.name} - مصغرة ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                      data-ai-hint="product thumbnail"
                    />
                  </button>
                ))}
                <Button variant="outline" size="icon" onClick={nextImage} aria-label="الصورة التالية">
                  <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                </Button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary mb-3">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="flex items-center text-2xl font-semibold text-foreground mb-6">
                    <Tag className="ml-2 h-6 w-6 text-muted-foreground rtl:mr-2 rtl:ml-0" />
                    {product.price} ج.م
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-center"><Info className="ml-2 h-5 w-5 text-muted-foreground rtl:mr-2 rtl:ml-0" /> الوصف:</h3>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
                
                <Separator className="my-6" />

                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                    <label htmlFor="quantity" className="font-medium">الكمية:</label>
                    <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-20 text-center h-10"
                    />
                </div>

                <Button size="lg" className="w-full text-lg py-3 group" onClick={handleAddToCart}>
                    <ShoppingCart className="ml-2 h-5 w-5 transition-transform group-hover:scale-110 rtl:mr-2 rtl:ml-0" />
                    أضف إلى السلة
                </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
