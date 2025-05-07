"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/types";
import { Search, ShoppingCartIcon, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

const ProductCardSkeleton = () => (
  <Card className="overflow-hidden shadow-lg">
    <div className="w-full h-64 bg-muted animate-pulse"></div>
    <CardHeader>
      <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
    </CardHeader>
    <CardContent>
      <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
    </CardContent>
    <CardFooter className="flex flex-col gap-2">
      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
    </CardFooter>
  </Card>
);

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const { products, isLoading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "الكل");

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || "");
    setSelectedCategory(searchParams.get('category') || "الكل");
  }, [searchParams]);

  const categories = useMemo(() => {
    const allCategories = new Set(products.map(p => p.category));
    return ["الكل", ...Array.from(allCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `${product.name} أضيف إلى سلة التسوق.`,
    });
  };

  if (productsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground">
          لم يتم العثور على منتجات تطابق بحثك.
        </p>
        <p className="text-md text-muted-foreground/80 mt-2">
          جرّب تعديل كلمات البحث أو الفئة المختارة.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-muted/30 dark:bg-muted/10 p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-2">جميع المنتجات</h1>
        <p className="text-lg text-foreground/80">تصفح مجموعتنا الكاملة من إكسسوارات الموبايل.</p>
      </section>

      <section className="flex flex-col md:flex-row gap-4 mb-8 p-4 border border-border rounded-lg shadow-sm bg-card">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="ابحث بالاسم أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 text-lg pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px] h-11 text-lg">
            <SelectValue placeholder="اختر الفئة" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="text-md">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden shadow-lg transition-all hover:shadow-xl flex flex-col">
            <Link href={`/products/${product.id}`} className="block">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <Image
                  src={product.images[0] || "https://picsum.photos/seed/product/400"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                  data-ai-hint="mobile accessory"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg truncate">{product.name}</CardTitle>
              </CardHeader>
            </Link>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
              <p className="text-xl font-semibold text-primary">{product.price.toFixed(2)} ج.م</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
              <Button className="w-full group" onClick={() => handleAddToCart(product)}>
                أضف للسلة <ShoppingCartIcon className="mr-1 h-4 w-4 transition-transform group-hover:scale-110 rtl:ml-1 rtl:mr-0" />
              </Button>
              <Button asChild variant="outline" className="w-full group">
                <Link href={`/products/${product.id}`}>
                  عرض التفاصيل <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;
