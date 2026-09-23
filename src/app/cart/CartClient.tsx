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
        <div className={styles.cartMain}>
          <header className={styles.pageHeader}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{language === "ar" ? "سلة المشتريات" : "Your Cart"}</h1>
            </div>
            <div className={styles.headerAccent} aria-hidden="true" />
          </header>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>
              {language === "ar" ? "سلتك فارغة" : "Your cart is empty"}
            </h2>
            <p className={styles.emptySubtitle}>
              {language === "ar" 
                ? "لم تقم بإضافة أي أطباق إلى سلتك بعد." 
                : "You haven't added any dishes to your cart yet."}
            </p>
            <Link href="/menu" className={styles.browseBtn}>
              {language === "ar" ? "تصفح المنيو" : "Browse Menu"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartMain}>
        <header className={styles.pageHeader}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{language === "ar" ? "سلة المشتريات" : "Your Cart"}</h1>
            <span className={styles.itemCountBadge}>
              {items.length} {language === "ar" ? (items.length === 1 ? "طبق" : "أطباق") : (items.length === 1 ? "item" : "items")}
            </span>
          </div>
          <div className={styles.headerAccent} aria-hidden="true" />
        </header>

        <div className={styles.itemsList}>
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
                    <div className={styles.packageBox}>
                      <div className={styles.packageBoxTitle}>
                        {language === "ar" ? "تفاصيل الباقة:" : "Package Details:"}
                      </div>
                      {item.packageSelections.map((sel, idx) => (
                        <div key={idx} className={styles.packageBoxRow}>
                          <span>{language === "ar" ? `اليوم ${sel.dayIndex + 1}` : `Day ${sel.dayIndex + 1}`}</span>
                          <span className={styles.packageBoxMeal}>
                            {language === "ar" ? sel.mealName.ar : sel.mealName.en}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.itemFooter}>
                  <div className={styles.itemPrice}>
                    {item.totalPrice * item.quantity} {language === "ar" ? "درهم" : "AED"}
                  </div>
                  
                  <div className={styles.qtyControl}>
                    <button 
                      type="button"
                      className={styles.qtyBtn} 
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        } else {
                          removeItem(item.id);
                        }
                      }}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button 
                      type="button"
                      className={styles.qtyBtn} 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                    title={language === "ar" ? "حذف الطبق" : "Remove item"}
                    aria-label={language === "ar" ? "حذف الطبق" : "Remove item"}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.trashIcon}>
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.orderNotesSection}>
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

        <div className={styles.checkoutSection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{language === "ar" ? "المجموع" : "Total"}</span>
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
    </div>
  );
}
