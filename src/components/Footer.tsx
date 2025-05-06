// src/components/Footer.tsx
import { SITE_NAME } from "@/lib/constants";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 text-muted-foreground py-8 mt-auto border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-right">
            <p className="text-sm">
              &copy; {currentYear} {SITE_NAME}. جميع الحقوق محفوظة.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
              <Facebook size={24} />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
              <Instagram size={24} />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors">
              <Twitter size={24} />
            </Link>
             <Link href="/contact" aria-label="Contact Us" className="hover:text-primary transition-colors">
              تواصل معنا
            </Link>
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm">
              تصميم وتطوير بواسطة فريق AAAMO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
