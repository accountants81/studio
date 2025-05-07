// src/app/admin/products/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit3, Trash2, Search, PackageOpen } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AdminProductsPage = () => {
  const { products, deleteProduct, isLoading } = useProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (productId: string, productName: string) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف المنتج "${productName}".`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف المنتج. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">إدارة المنتجات</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Input 
              type="search"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 w-full md:w-64 bg-[var(--input)] text-foreground border-[var(--border)] focus:ring-[var(--ring)]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
          </div>
          <Button asChild className="group bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">
            <Link href="/admin/products/new">
              <PlusCircle className="ml-2 h-5 w-5 transition-transform group-hover:rotate-90 rtl:mr-2 rtl:ml-0" />
              إضافة منتج جديد
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">جارِ تحميل المنتجات...</p>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[var(--card)] rounded-lg shadow border border-[var(--border)]">
            <PackageOpen className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {searchTerm ? "لم يتم العثور على منتجات" : "لا توجد منتجات بعد"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "جرّب تعديل بحثك أو قم بإضافة منتجات جديدة." : "ابدأ بإضافة أول منتج إلى متجرك."}
            </p>
            {!searchTerm && (
                <Button asChild className="group bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">
                    <Link href="/admin/products/new">
                    <PlusCircle className="ml-2 h-5 w-5 transition-transform group-hover:rotate-90 rtl:mr-2 rtl:ml-0" />
                    إضافة المنتج الأول
                    </Link>
                </Button>
            )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-[var(--card)] rounded-lg shadow border border-[var(--border)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[var(--border)]">
                <TableHead className="w-[80px] text-muted-foreground">الصورة</TableHead>
                <TableHead className="text-muted-foreground">الاسم</TableHead>
                <TableHead className="text-muted-foreground">الفئة</TableHead>
                <TableHead className="text-center text-muted-foreground">السعر (ج.م)</TableHead>
                <TableHead className="text-center text-muted-foreground">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-[var(--muted)]/50 border-b-[var(--border)] last:border-b-0">
                  <TableCell>
                    <Image
                      src={product.images[0] || "https://picsum.photos/seed/adminprod/100"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover aspect-square border border-[var(--border)]"
                      data-ai-hint="product thumbnail"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80">{product.category}</Badge></TableCell>
                  <TableCell className="text-center">{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
                      <Button asChild variant="outline" size="sm" className="group border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit3 className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span className="sr-only md:not-sr-only md:ml-1 rtl:md:mr-1 rtl:md:ml-0">تعديل</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="group bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90">
                            <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                             <span className="sr-only md:not-sr-only md:ml-1 rtl:md:mr-1 rtl:md:ml-0">حذف</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[var(--popover)] text-[var(--popover-foreground)] border-[var(--border)]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المنتج بشكل دائم
                              <span className="font-semibold text-[var(--destructive)]"> "{product.name}" </span>
                              من خوادمنا.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">إلغاء</AlertDialogCancel>
                            <AlertDialogAction className="bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90" onClick={() => handleDelete(product.id, product.name)}>
                              نعم، احذف المنتج
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

export default AdminProductsPage;
