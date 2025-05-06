// src/app/(main)/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/types";
import { ArrowLeft, Package, Shield, Smartphone } from "lucide-react";

const HomePage = () => {
  const { products, isLoading } = useProducts();

  // Get up to 4 featured products
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: "جرابات", href: "/products?category=جرابات", icon: <Smartphone className="h-12 w-12 text-primary" /> },
    { name: "واقيات شاشة", href: "/products?category=واقيات شاشة", icon: <Shield className="h-12 w-12 text-primary" /> },
    { name: "شواحن وكوابل", href: "/products?category=شواحن", icon: <Package className="h-12 w-12 text-primary" /> },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-background to-muted/30 dark:from-background dark:to-muted/10 rounded-lg shadow-xl overflow-hidden p-8 md:p-16 text-center md:text-right">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          {/* Optional subtle background pattern or image */}
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            أفضل إكسسوارات الموبايل في مكان واحد!
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto md:mx-0 md:mr-auto">
            اكتشف مجموعتنا الواسعة من الجرابات، واقيات الشاشة، الشواحن، والمزيد. جودة عالية بأسعار تنافسية.
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/products">
              تصفح المنتجات الآن <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
         <div className="absolute left-0 bottom-0 w-1/3 h-full opacity-20 hidden md:block" data-ai-hint="abstract tech background">
          <Image src="https://picsum.photos/seed/hero-bg/600/800" alt="Hero Background" layout="fill" objectFit="cover" className="rounded-r-lg"/>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">منتجات مميزة</h2>
        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
                <div className="w-full h-64 bg-muted animate-pulse"></div>
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden shadow-lg transition-all hover:shadow-xl flex flex-col">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square w-full overflow-hidden">
                    <Image
                      src={product.images[0] || "https://picsum.photos/400"}
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
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-semibold text-primary">{product.price} ج.م</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group">
                    <Link href={`/products/${product.id}`}>
                      عرض التفاصيل <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">لا توجد منتجات مميزة حالياً.</p>
        )}
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">تصفح حسب الفئة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="text-center p-6 hover:shadow-xl transition-shadow hover:border-primary/50 cursor-pointer h-full flex flex-col justify-center items-center">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
