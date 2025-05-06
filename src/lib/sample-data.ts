// src/lib/sample-data.ts
import type { Product } from "@/types";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "جراب سيليكون فاخر لآيفون 15 برو",
    description: "جراب سيليكون عالي الجودة يوفر حماية ممتازة وملمس ناعم لهاتف آيفون 15 برو. متوفر بألوان متعددة.",
    price: 250,
    images: ["https://picsum.photos/seed/case1/400/400", "https://picsum.photos/seed/case1_alt/400/400"],
    category: "جرابات",
  },
  {
    id: "2",
    name: "واقي شاشة زجاجي لسامسونج جالاكسي S24 ألترا",
    description: "واقي شاشة من الزجاج المقوى بدرجة صلابة 9H، مقاوم للخدوش والصدمات، ويحافظ على وضوح الشاشة.",
    price: 180,
    images: ["https://picsum.photos/seed/screenprotector1/400/400"],
    category: "واقيات شاشة",
  },
  {
    id: "3",
    name: "شاحن سريع 65 واط USB-C PD",
    description: "شاحن جداري بتقنية الشحن السريع Power Delivery، يدعم شحن اللابتوبات والهواتف المتوافقة بقوة تصل إلى 65 واط.",
    price: 450,
    images: ["https://picsum.photos/seed/charger1/400/400"],
    category: "شواحن",
  },
  {
    id: "4",
    name: "سماعات أذن لاسلكية بلوتوث 5.3",
    description: "سماعات أذن لاسلكية بصوت نقي وجودة عالية، تدعم بلوتوث 5.3 وتوفر عمر بطارية طويل.",
    price: 600,
    images: ["https://picsum.photos/seed/earbuds1/400/400", "https://picsum.photos/seed/earbuds1_alt/400/400"],
    category: "إكسسوارات صوت",
  },
  {
    id: "5",
    name: "كابل شحن USB-C إلى Lightning معتمد MFi",
    description: "كابل شحن ونقل بيانات معتمد من آبل، يضمن التوافق والأداء الأمثل مع أجهزة آيفون وآيباد.",
    price: 220,
    images: ["https://picsum.photos/seed/cable1/400/400"],
    category: "كوابل",
  },
  {
    id: "6",
    name: "حامل هاتف مغناطيسي للسيارة",
    description: "حامل هاتف قوي للسيارة يتم تثبيته على فتحة التهوية، يوفر تثبيتًا آمنًا وسهل الاستخدام.",
    price: 150,
    images: ["https://picsum.photos/seed/carholder1/400/400"],
    category: "حوامل",
  },
  {
    id: "7",
    name: "جراب شفاف مقاوم للصدمات لـ OnePlus 12",
    description: "جراب شفاف يبرز تصميم الهاتف مع توفير حماية قوية ضد السقوط والصدمات.",
    price: 200,
    images: ["https://picsum.photos/seed/case2/400/400"],
    category: "جرابات",
  },
  {
    id: "8",
    name: "باور بانك 20000 مللي أمبير",
    description: "بطارية متنقلة بسعة كبيرة 20000 مللي أمبير، تدعم الشحن السريع لأجهزة متعددة.",
    price: 750,
    images: ["https://picsum.photos/seed/powerbank1/400/400"],
    category: "شواحن",
  },
];
