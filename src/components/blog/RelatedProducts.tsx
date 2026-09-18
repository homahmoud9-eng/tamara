'use client';

import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import { useApp } from '@/components/providers/AppProvider';

export interface RelatedProductItem {
  id: string;
  nameAr: string;
  nameEn?: string | null;
  basePrice: number;
  primaryImage?: string | null;
  category?: {
    slug: string;
    nameAr?: string | null;
    nameEn?: string | null;
  } | null;
  variants?: {
    id: string;
    price: number;
    nameAr: string;
  }[];
}

interface RelatedProductsProps {
  products: RelatedProductItem[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const { language } = useApp();

  if (!products || products.length === 0) return null;

  return (
    <section 
      aria-label={language === 'ar' ? 'منتجات ذات صلة' : 'Related Products'}
      style={{ 
        marginTop: '48px', 
        paddingTop: '32px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
      }}
    >
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <span style={{ 
          display: 'inline-block',
          color: '#d4af37', 
          fontSize: '13px', 
          fontWeight: 600, 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          {language === 'ar' ? 'طعم البيت المصري' : "Tamara's Kitchen"}
        </span>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 700, 
          margin: 0,
          color: '#ffffff' 
        }}>
          {language === 'ar' ? 'أطباق طازجة ننصحك بتجربتها اليوم' : 'Fresh Dishes Recommended For You'}
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
      }}>
        {products.map((product) => {
          const categorySlug = product.category?.slug || '';
          const targetUrl = categorySlug ? `/menu/${categorySlug}` : `/product/${product.id}`;
          const minVariantPrice = product.variants && product.variants.length > 0 
            ? Math.min(...product.variants.map(v => v.price))
            : product.basePrice;
          const displayPrice = minVariantPrice || product.basePrice;

          return (
            <div
              key={product.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '190px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <SafeImage
                  src={product.primaryImage || '/assets/images/logo.png'}
                  alt={language === 'ar' ? product.nameAr : (product.nameEn || product.nameAr)}
                  fill
                  className="object-cover"
                />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {product.category && (
                  <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 500, marginBottom: '6px' }}>
                    {language === 'ar' ? product.category.nameAr : (product.category.nameEn || product.category.nameAr)}
                  </span>
                )}
                
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  margin: '0 0 10px 0', 
                  color: '#ffffff',
                  lineHeight: '1.4'
                }}>
                  {language === 'ar' ? product.nameAr : (product.nameEn || product.nameAr)}
                </h3>

                <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#d4af37' }}>
                    {displayPrice} {language === 'ar' ? 'درهم' : 'AED'}
                  </span>

                  <Link
                    href={targetUrl}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#d4af37',
                      color: '#0f172a',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {language === 'ar' ? 'تصفح واطلب الآن' : 'Browse & Order'}
                    <span aria-hidden="true">{language === 'ar' ? '←' : '→'}</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
