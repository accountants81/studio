// src/app/(main)/contact/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Contact form submitted:", formData);
    toast({
      title: "تم إرسال رسالتك بنجاح!",
      description: "سوف نقوم بالرد عليك في أقرب وقت ممكن.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-muted/30 dark:bg-muted/10 p-6 rounded-lg shadow-md mb-12 text-center">
        <Mail className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">تواصل معنا</h1>
        <p className="text-lg text-foreground/80">
          نحن هنا لمساعدتك! لا تتردد في الاتصال بنا لأي استفسارات أو اقتراحات.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Mail className="ml-3 mt-1 h-6 w-6 text-primary flex-shrink-0 rtl:mr-3 rtl:ml-0" />
                <div>
                  <h3 className="font-semibold">البريد الإلكتروني:</h3>
                  <a href="mailto:searchemail85@gmail.com" className="text-foreground/80 hover:text-primary transition-colors">
                    searchemail85@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="ml-3 mt-1 h-6 w-6 text-primary flex-shrink-0 rtl:mr-3 rtl:ml-0" />
                <div>
                  <h3 className="font-semibold">الهاتف:</h3>
                  <p className="text-foreground/80" dir="ltr">+20 123 456 7890</p> {/* Example phone */}
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="ml-3 mt-1 h-6 w-6 text-primary flex-shrink-0 rtl:mr-3 rtl:ml-0" />
                <div>
                  <h3 className="font-semibold">العنوان:</h3>
                  <p className="text-foreground/80">
                    123 شارع المعز، القاهرة، مصر (مثال)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">ساعات العمل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-foreground/80">
                <p>السبت - الخميس: 10:00 صباحًا - 10:00 مساءً</p>
                <p>الجمعة: 2:00 ظهرًا - 10:00 مساءً</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">أرسل لنا رسالة</CardTitle>
            <CardDescription>املأ النموذج أدناه وسنتصل بك قريباً.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input id="name" placeholder="اسمك الكامل" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="بريدك الإلكتروني" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع</Label>
                <Input id="subject" placeholder="موضوع رسالتك" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">الرسالة</Label>
                <Textarea id="message" placeholder="اكتب رسالتك هنا..." rows={5} value={formData.message} onChange={handleChange} required />
              </div>
              <Button type="submit" className="w-full text-lg group" disabled={isSubmitting}>
                {isSubmitting ? "جارِ الإرسال..." : (
                  <>
                    إرسال الرسالة <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 rtl:ml-2 rtl:mr-0" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
