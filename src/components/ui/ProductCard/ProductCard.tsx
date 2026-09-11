import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import { useCart } from '@/components/providers/CartProvider';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import { Product } from '@/models/types';
import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const { language } = useApp();
  const { addItem } = useCart();
  const router = useRouter();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const hasRequiredAddons = product.addonGroups && product.addonGroups.some(g => g.required);
    const hasMultipleVariants = product.variants && product.variants.length > 1;

    if (hasRequiredAddons || hasMultipleVariants) {
      router.push(`/product/${product.id}`);
      return;
    }

    // Direct add for simple products
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const basePrice = defaultVariant ? defaultVariant.price : product.price;

    addItem({
      id: `${product.id}-${defaultVariant?.id || 'base'}---`, // Simple distinct id for no-options
      productId: product.id,
      name: product.name,
      variantId: defaultVariant?.id || null,
      addons: {},
      quantity: 1,
      totalPrice: basePrice || 0,
      notes: ''
    });

    // Simple toast or mini-cart visual feedback could go here
    alert(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  return (
    <Link href={`/product/${product.id}`} className={`${styles.productCard} hover-glow`}>
      <div className={styles.imageWrapper}>
        <SafeImage
          src={product.baseImage || product.image || ""}
          alt={language === "ar" ? product.name.ar : product.name.en}
          fill
          className="object-cover"
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          {language === "ar" ? product.name.ar : product.name.en}
        </h3>
        <p className={styles.productDesc}>
          {language === "ar" ? product.description.ar : product.description.en}
        </p>
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {product.price || (product.variants?.find(v => v.isDefault)?.price) || (product.variants?.[0]?.price) || 0} {language === "ar" ? "درهم" : "AED"}
          </span>
          <button className={styles.addBtn} onClick={handleQuickAdd} aria-label="Add to cart">
            +
          </button>
        </div>
      </div>
    </Link>
  );
}
