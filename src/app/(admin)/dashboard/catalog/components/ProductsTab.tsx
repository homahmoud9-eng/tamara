import React from 'react';
import { Product, Category } from '@prisma/client';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import { Language } from '@/lib/i18n';
import { deleteProduct } from '../actions';

type ProductWithCategory = Product & { category: Category };

export function ProductsTab({ products, categories, lang }: { products: ProductWithCategory[], categories: Category[], lang: Language }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select className="admin-input" style={{ width: '200px' }}>
            <option value="">{lang === 'ar' ? 'جميع الأقسام' : 'All Categories'}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder={lang === 'ar' ? "ابحث عن منتجات..." : "Search products..."} 
            className="admin-input"
            style={{ width: '250px' }}
          />
        </div>
        
        <Link href="/dashboard/catalog/products/new" className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          {lang === 'ar' ? 'إضافة منتج' : 'Add Product'}
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'صورة' : 'Image'}</th>
              <th>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
              <th>{lang === 'ar' ? 'القسم' : 'Category'}</th>
              <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                  {lang === 'ar' ? 'لم يتم العثور على منتجات.' : 'No products found.'}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.primaryImage ? (
                      <img src={product.primaryImage} alt={product.nameEn} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, backgroundColor: '#f3f4f6', borderRadius: 8 }} />
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{lang === 'ar' ? product.nameAr : product.nameEn}</span>
                      {product.isFeatured && <Star size={14} color="#eab308" fill="#eab308" />}
                    </div>

                  </td>
                  <td>
                    <span className="admin-badge neutral">
                      {lang === 'ar' ? product.category.nameAr : product.category.nameEn}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>SAR {product.basePrice.toFixed(2)}</td>
                  <td>
                    <span className={`admin-badge ${product.isActive ? 'success' : 'neutral'}`}>
                      {product.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions" style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/dashboard/catalog/products/${product.id}/edit`} className="admin-icon-btn" aria-label="Edit" style={{ color: '#3b82f6' }}>
                        <Edit2 size={16} />
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteProduct(product.id);
                      }}>
                        <button type="submit" className="admin-icon-btn" aria-label="Delete" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
