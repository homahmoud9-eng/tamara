"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { useCart } from "@/components/providers/CartProvider";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import styles from "./cart.module.css";
import { Product } from "@/models/types";

interface CartClientProps {
  allProducts: Product[];
}

export function CartClient({ allProducts }: CartClientProps) {
  const { language } = useApp();
  const { items, totalAmount, updateQuantity, removeItem, orderNotes, setOrderNotes } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>{language === "ar" ? "سلة المشتريات" : "Your Cart"}</h1>
          </div>
        </header>
        <div className={`container ${styles.emptyState}`}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>
            {language === "ar" ? "سلتك فارغة" : "Your cart is empty"}
          </h2>
          <p style={{ marginBottom: '24px' }}>
            {language === "ar" 
              ? "لم تقم بإضافة أي أطباق إلى سلتك بعد." 
              : "You haven't added any dishes to your cart yet."}
          </p>
          <Link href="/menu" className={styles.browseBtn}>
            {language === "ar" ? "تصفح المنيو" : "Browse Menu"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "سلة المشتريات" : "Your Cart"}</h1>
        </div>
      </header>

      <div className={`container ${styles.itemsList}`}>
        {items.map(item => {
          const product = allProducts.find(p => p.id === item.productId);
          if (!product) return null;

          const variant = product.variants?.find(v => v.id === item.variantId);
          const image = variant?.image || product.baseImage || product.image || "";

          // Resolve addons names
          const activeAddonNames: string[] = [];
          if (product.addonGroups) {
            Object.entries(item.addons).forEach(([groupId, addonIds]) => {
              const group = product.addonGroups?.find(g => g.id === groupId);
              if (group) {
                addonIds.forEach(id => {
                  const a = group.addons.find(x => x.id === id);
                  if (a) activeAddonNames.push(language === "ar" ? a.name.ar : a.name.en);
                });
              }
            });
          }

          return (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <SafeImage src={image} alt={language === "ar" ? product.name.ar : product.name.en} fill className="object-cover" />
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>
                  {language === "ar" ? product.name.ar : product.name.en}
                </div>
                
                {variant && (
                  <div className={styles.itemVariant}>
                    {language === "ar" ? variant.name.ar : variant.name.en}
                  </div>
                )}

                {activeAddonNames.length > 0 && (
                  <div className={styles.itemAddons}>
                    + {activeAddonNames.join('، ')}
                  </div>
                )}

                {item.notes && (
                  <div className={styles.itemNotes}>
                    {language === "ar" ? "ملاحظة: " : "Note: "}{item.notes}
                  </div>
                )}

                {item.packageSelections && item.packageSelections.length > 0 && (
                  <div style={{ marginTop: '8px', padding: '8px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '12px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--brand-primary)' }}>
                      {language === "ar" ? "تفاصيل الباقة:" : "Package Details:"}
                    </div>
                    {item.packageSelections.map((sel, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        <span>{language === "ar" ? `اليوم ${sel.dayIndex + 1}` : `Day ${sel.dayIndex + 1}`}</span>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          {language === "ar" ? sel.mealName.ar : sel.mealName.en}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.itemFooter}>
                  <div className={styles.itemPrice}>
                    {item.totalPrice * item.quantity} {language === "ar" ? "درهم" : "AED"}
                  </div>
                  <div className={styles.qtyControl}>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        } else {
                          removeItem(item.id);
                        }
                      }}
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`container ${styles.orderNotesSection}`}>
        <h3 className={styles.orderNotesTitle}>
          {language === "ar" ? "ملاحظات التوصيل (اختياري)" : "Delivery Notes (Optional)"}
        </h3>
        <textarea
          className={styles.orderNotesInput}
          placeholder={language === "ar" ? "مثال: اترك الطلب عند الباب، رن الجرس..." : "e.g., Leave at door, ring bell..."}
          value={orderNotes || ""}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.stickyFooter}>
        <div className="container">
          <div className={styles.summaryRow}>
            <span>{language === "ar" ? "المجموع" : "Total"}</span>
            <span className={styles.summaryTotal}>
              {totalAmount} {language === "ar" ? "درهم" : "AED"}
            </span>
          </div>
          <Link href="/checkout" className={styles.checkoutBtn}>
            {language === "ar" ? "متابعة الطلب" : "Proceed to Checkout"}
          </Link>
        </div>
      </div>
    </div>
  );
}
