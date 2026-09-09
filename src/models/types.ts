export type Language = 'ar' | 'en';

export type LocalizedString = {
  ar: string;
  en: string;
};

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  language: Language;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  lastActiveAt: string;
  notificationOptIn: boolean;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // e.g., "Home", "Work"
  emirate: string;
  area: string;
  street: string;
  building: string;
  apartment?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  image: string;
  titleImage?: string;
  sortOrder: number;
  active: boolean;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  name: LocalizedString; // e.g., { ar: "ربع فرخة", en: "Quarter Chicken" }
  price: number;
  image: string;
  mobileImage?: string;
  active: boolean;
  available?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
  servingDescription?: LocalizedString;
}

export interface Product {
  id: string;
  categoryId: string;
  name: LocalizedString;
  description: LocalizedString;
  baseImage: string; // Used if no variant is selected, or as fallback
  mobileImage?: string;
  active: boolean;
  featured: boolean;
  bestseller: boolean;
  sortOrder: number;
  variants: ProductVariant[];
  addonGroups?: AddonGroup[];
  ratingAggregate: number;
  reviewsCount: number;
  // UI Helpers for Landing Page cards
  price?: number;
  image?: string;
  rating?: number;
}

export interface Addon {
  id: string;
  name: LocalizedString;
  price: number;
}

export interface AddonGroup {
  id: string;
  productId: string;
  name: LocalizedString; // e.g., "أضف صوص"
  required: boolean;
  minSelect: number;
  maxSelect: number;
  addons: Addon[];
}

export interface Offer {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  image: string;
  mobileImage?: string;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  ctaText: LocalizedString;
  ctaLink: string;
  active: boolean;
}

export interface Banner {
  id: string;
  type: 'full-width' | 'compact-strip' | 'hero-card';
  title: LocalizedString;
  subtitle?: LocalizedString;
  image: string;
  mobileImage?: string;
  ctaText?: LocalizedString;
  ctaLink?: string;
  active: boolean;
}
