// src/lib/constants.ts

export const ADMIN_EMAIL = "searchemail85@gmail.com";
export const ADMIN_PASSWORD = "searchemail85@gmail.com"; // In a real app, use hashed passwords and secure storage.

export const SITE_NAME = "AAAMO";
export const SITE_DESCRIPTION = "متجر AAAMO لإكسسوارات الموبايل عالية الجودة";

export const MIN_ORDER_VALUE = 100; // EGP

export const EGYPTIAN_GOVERNORATES: { id: string; name: string; shippingCost: number }[] = [
  { id: "alexandria", name: "الإسكندرية", shippingCost: 50 },
  { id: "assiut", name: "أسيوط", shippingCost: 70 },
  { id: "aswan", name: "أسوان", shippingCost: 80 },
  { id: "beheira", name: "البحيرة", shippingCost: 55 },
  { id: "beni_suef", name: "بني سويف", shippingCost: 65 },
  { id: "cairo", name: "القاهرة", shippingCost: 35 },
  { id: "dakahlia", name: "الدقهلية", shippingCost: 50 },
  { id: "damietta", name: "دمياط", shippingCost: 55 },
  { id: "faiyum", name: "الفيوم", shippingCost: 60 },
  { id: "gharbia", name: "الغربية", shippingCost: 50 },
  { id: "giza", name: "الجيزة", shippingCost: 35 },
  { id: "ismailia", name: "الإسماعيلية", shippingCost: 60 },
  { id: "kafr_el_sheikh", name: "كفر الشيخ", shippingCost: 55 },
  { id: "luxor", name: "الأقصر", shippingCost: 75 },
  { id: "matruh", name: "مطروح", shippingCost: 90 },
  { id: "minya", name: "المنيا", shippingCost: 70 },
  { id: "monufia", name: "المنوفية", shippingCost: 50 },
  { id: "new_valley", name: "الوادي الجديد", shippingCost: 100 },
  { id: "north_sinai", name: "شمال سيناء", shippingCost: 85 },
  { id: "port_said", name: "بورسعيد", shippingCost: 60 },
  { id: "qalyubia", name: "القليوبية", shippingCost: 40 },
  { id: "qena", name: "قنا", shippingCost: 75 },
  { id: "red_sea", name: "البحر الأحمر", shippingCost: 95 },
  { id: "sharqia", name: "الشرقية", shippingCost: 50 },
  { id: "sohag", name: "سوهاج", shippingCost: 70 },
  { id: "south_sinai", name: "جنوب سيناء", shippingCost: 90 },
  { id: "suez", name: "السويس", shippingCost: 60 },
];
