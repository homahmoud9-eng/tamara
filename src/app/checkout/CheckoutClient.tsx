"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { useCart } from "@/components/providers/CartProvider";
import styles from "./checkout.module.css";
import { validateCoupon } from "./actions";

export default function CheckoutClient({
  savedAddresses,
  initialPhone,
  initialName,
  isAuthenticated
}: {
  savedAddresses: any[];
  initialPhone: string;
  initialName: string;
  isAuthenticated: boolean;
}) {
  const { language } = useApp();
  const { items, totalAmount, orderNotes, clearCart } = useCart();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialName || "",
    phone: initialPhone || "",
    addressText: "",
    addressId: savedAddresses.length > 0 ? savedAddresses[0].id : "",
    isNewAddress: savedAddresses.length === 0,
    customerNotes: orderNotes || "",
    deliveryDetails: {
      emirate: "أبوظبي",
      area: "",
      street: "",
      building: "",
      apartment: "",
      landmark: ""
    }
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Note: The UI total is just informational. The server determines the final total.
  const grandTotal = totalAmount - (appliedCoupon?.discountAmount || 0);

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    const res = await validateCoupon(couponCode, totalAmount);
    setIsApplyingCoupon(false);

    if (res.error) {
      setAppliedCoupon(null);
      switch(res.error) {
        case 'invalid': setCouponError(language === 'ar' ? 'كود الخصم غير صحيح' : 'Invalid coupon code'); break;
        case 'inactive': setCouponError(language === 'ar' ? 'كود الخصم غير فعال' : 'Inactive coupon code'); break;
        case 'expired': setCouponError(language === 'ar' ? 'كود الخصم منتهي الصلاحية' : 'Expired coupon code'); break;
        case 'min_order': setCouponError(language === 'ar' ? `الحد الأدنى للطلب هو ${res.minOrder} درهم` : `Minimum order is ${res.minOrder} AED`); break;
        default: setCouponError(language === 'ar' ? 'حدث خطأ' : 'An error occurred'); break;
      }
    } else if (res.success && res.coupon) {
      setAppliedCoupon({
        code: res.coupon.code,
        discountAmount: res.coupon.discountAmount
      });
      setCouponCode("");
    }
  };

  const handlePlaceOrder = async () => {
    setCheckoutError("");
    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        addressId: formData.isNewAddress ? undefined : formData.addressId,
        addressDetails: formData.isNewAddress ? formData.deliveryDetails : undefined,
        items: items,
        couponCode: appliedCoupon?.code || null,
        paymentMethod: paymentMethod,
        customerNotes: formData.customerNotes
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPlacedOrderId(data.order.id);
        setWhatsappUrl(data.whatsappUrl);
        setIsSuccess(true);
        clearCart();
        
        if (data.whatsappUrl) {
          window.location.href = data.whatsappUrl;
        }
      } else {
        if (data.code === 'CART_UPDATED') {
          setCheckoutError(language === 'ar' 
            ? 'بعض المنتجات أو أسعارها تغيرت. يرجى مراجعة السلة.' 
            : 'Some items or prices have changed. Please review your cart.');
        } else if (data.code === 'COUPON_INVALID') {
          setCheckoutError(language === 'ar' 
            ? 'كود الخصم غير صالح أو منتهي.' 
            : 'Coupon is invalid or expired.');
          setAppliedCoupon(null);
        } else {
          setCheckoutError(data.message || (language === 'ar' ? 'حدث خطأ أثناء الطلب.' : 'Error placing order.'));
        }
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setCheckoutError(language === 'ar' ? 'حدث خطأ غير متوقع.' : 'Unexpected error.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const isFormValid = formData.name.trim() !== "" && 
                      formData.phone.trim() !== "" && 
                      (formData.isNewAddress 
                        ? (formData.deliveryDetails.emirate !== "" && 
                           formData.deliveryDetails.area.trim() !== "" && 
                           formData.deliveryDetails.street.trim() !== "" && 
                           formData.deliveryDetails.building.trim() !== "") 
                        : formData.addressId !== "");

  if (isSuccess) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className={styles.successTitle}>
          {language === "ar" ? "تم تأكيد طلبك!" : "Order Confirmed!"}
        </h1>
        <p className={styles.successDesc}>
          {language === "ar" 
            ? "شكراً لك. سيتم متابعة طلبك عبر واتساب." 
            : "Thank you. Your order will be followed up via WhatsApp."}
        </p>
        {whatsappUrl && (
          <button 
            onClick={() => window.location.href = whatsappUrl} 
            className={styles.whatsappBtn}
            style={{ marginBottom: '16px' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {language === "ar" ? "إرسال عبر واتساب مجدداً" : "Send via WhatsApp again"}
          </button>
        )}
        <Link href={`/orders/${placedOrderId || ''}`} className={styles.trackBtn}>
          {language === "ar" ? "تتبع الطلب" : "Track Order"}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "الدفع والتوصيل" : "Checkout"}</h1>
        </div>
      </header>

      {checkoutError && (
        <div style={{ margin: '16px', padding: '16px', background: 'rgba(255,0,0,0.1)', color: 'red', borderRadius: '8px' }}>
          {checkoutError}
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {language === "ar" ? "معلومات العميل" : "Customer Information"}
        </h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{language === "ar" ? "الاسم" : "Name"}</label>
          <input 
            type="text" 
            className={styles.input} 
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder={language === "ar" ? "أدخل اسمك" : "Enter your name"}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{language === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
          <input 
            type="tel" 
            className={styles.input} 
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder={language === "ar" ? "أدخل رقمك" : "Enter your phone"}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {language === "ar" ? "معلومات التوصيل" : "Delivery Details"}
        </h2>
        {savedAddresses.length > 0 && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <input 
                type="radio" 
                checked={!formData.isNewAddress}
                onChange={() => setFormData({ ...formData, isNewAddress: false })}
                style={{ marginLeft: '8px', marginRight: '8px' }}
              />
              {language === "ar" ? "اختيار عنوان محفوظ" : "Select saved address"}
            </label>
            {!formData.isNewAddress && (
              <select 
                className={styles.input}
                value={formData.addressId}
                onChange={e => setFormData({ ...formData, addressId: e.target.value })}
                style={{ marginTop: '8px' }}
              >
                {savedAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{addr.label || addr.addressText}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {(savedAddresses.length === 0 || formData.isNewAddress || !isAuthenticated) && (
          <div className={styles.inputGroup}>
            {savedAddresses.length > 0 && (
              <label className={styles.label} style={{ marginBottom: '16px' }}>
                <input 
                  type="radio" 
                  checked={formData.isNewAddress}
                  onChange={() => setFormData({ ...formData, isNewAddress: true })}
                  style={{ marginLeft: '8px', marginRight: '8px' }}
                />
                {language === "ar" ? "إضافة عنوان جديد" : "Add new address"}
              </label>
            )}
            
            <div className={styles.addressGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{language === "ar" ? "الإمارة *" : "Emirate *"}</label>
                <select 
                  className={styles.select}
                  value={formData.deliveryDetails.emirate}
                  onChange={e => setFormData({ ...formData, deliveryDetails: { ...formData.deliveryDetails, emirate: e.target.value }})}
                >
                  <option value="أبوظبي">{language === "ar" ? "أبوظبي" : "Abu Dhabi"}</option>
                  <option value="دبي">{language === "ar" ? "دبي" : "Dubai"}</option>
                  <option value="الشارقة">{language === "ar" ? "الشارقة" : "Sharjah"}</option>
                  <option value="عجمان">{language === "ar" ? "عجمان" : "Ajman"}</option>
                  <option value="أم القيوين">{language === "ar" ? "أم القيوين" : "Umm Al-Quwain"}</option>
                  <option value="رأس الخيمة">{language === "ar" ? "رأس الخيمة" : "Ras Al Khaimah"}</option>
                  <option value="الفجيرة">{language === "ar" ? "الفجيرة" : "Fujairah"}</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{language === "ar" ? "المنطقة / الحي *" : "Area / Neighborhood *"}</label>
                <input 
                  type="text"
                  className={styles.input} 
                  value={formData.deliveryDetails.area}
                  onChange={e => setFormData({ ...formData, deliveryDetails: { ...formData.deliveryDetails, area: e.target.value }})}
                  placeholder={language === "ar" ? "أدخل اسم المنطقة" : "Enter area name"}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{language === "ar" ? "اسم الشارع *" : "Street Name *"}</label>
                <input 
                  type="text"
                  className={styles.input} 
                  value={formData.deliveryDetails.street}
                  onChange={e => setFormData({ ...formData, deliveryDetails: { ...formData.deliveryDetails, street: e.target.value }})}
                  placeholder={language === "ar" ? "أدخل اسم الشارع" : "Enter street name"}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{language === "ar" ? "المبنى / الفيلا *" : "Building / Villa *"}</label>
                <input 
                  type="text"
                  className={styles.input} 
                  value={formData.deliveryDetails.building}
                  onChange={e => setFormData({ ...formData, deliveryDetails: { ...formData.deliveryDetails, building: e.target.value }})}
                  placeholder={language === "ar" ? "رقم أو اسم المبنى" : "Building number or name"}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{language === "ar" ? "الشقة / الوحدة (اختياري)" : "Apartment / Unit (Optional)"}</label>
                <input 
                  type="text"
                  className={styles.input} 
                  value={formData.deliveryDetails.apartment}
                  onChange={e => setFormData({ ...formData, deliveryDetails: { ...formData.deliveryDetails, apartment: e.target.value }})}
                  placeholder={language === "ar" ? "رقم الشقة" : "Apartment number"}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{language === "ar" ? "أقرب معلم (اختياري)" : "Nearest Landmark (Optional)"}</label>
                <input 
                  type="text"
                  className={styles.input} 
                  value={formData.deliveryDetails.landmark}
                  onChange={e => setFormData({ ...formData, deliveryDetails: { ...formData.deliveryDetails, landmark: e.target.value }})}
                  placeholder={language === "ar" ? "بجوار..." : "Near..."}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
          <label className={styles.label}>{language === "ar" ? "ملاحظات الطلب (اختياري)" : "Order Notes (Optional)"}</label>
          <textarea 
            className={styles.input} 
            rows={2}
            value={formData.customerNotes}
            onChange={e => setFormData({ ...formData, customerNotes: e.target.value })}
            placeholder={language === "ar" ? "أي ملاحظات إضافية للتوصيل..." : "Any extra delivery notes..."}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {language === "ar" ? "طريقة الدفع" : "Payment Method"}
        </h2>
        <div className={styles.paymentMethods}>
          <div 
            className={`${styles.paymentCard} ${paymentMethod === 'cash' ? styles.paymentCardActive : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <svg className={styles.paymentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01M18 12h.01"></path>
            </svg>
            <div>
              <div className={styles.paymentName}>{language === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}</div>
              <div className={styles.paymentDesc}>{language === "ar" ? "ادفع نقداً عند وصول المندوب" : "Pay cash when order arrives"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {language === "ar" ? "ملخص الطلب" : "Order Summary"}
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <div>
                <strong>{item.quantity}x</strong> {language === 'ar' ? item.name?.ar : item.name?.en} 
                {item.variantName && ` (${language === 'ar' ? item.variantName.ar : item.variantName.en})`}
                
                {Object.values(item.addons).flat().length > 0 && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {language === 'ar' ? 'إضافات محددة' : 'With addons'}
                  </div>
                )}
              </div>
              <div>{(item.totalPrice * item.quantity).toFixed(2)} {language === "ar" ? "د.إ" : "AED"}</div>
            </div>
          ))}
        </div>

        {!appliedCoupon ? (
          <div className={styles.couponForm}>
            <input 
              type="text" 
              className={styles.couponInput}
              placeholder={language === "ar" ? "كود الخصم" : "Coupon Code"}
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
            />
            <button 
              className={styles.couponBtn}
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
            >
              {isApplyingCoupon ? '...' : (language === "ar" ? "تطبيق" : "Apply")}
            </button>
          </div>
        ) : (
          <div className={styles.couponMessage}>
            <span className={styles.couponSuccess}>
              ✓ {language === 'ar' ? 'تم تطبيق كود الخصم:' : 'Coupon applied:'} <strong>{appliedCoupon.code}</strong>
            </span>
            <button 
              onClick={() => setAppliedCoupon(null)} 
              style={{ background: 'none', border: 'none', color: 'var(--color-error)', textDecoration: 'underline', fontSize: '12px' }}
            >
              {language === 'ar' ? 'إزالة' : 'Remove'}
            </button>
          </div>
        )}

        {couponError && (
          <div className={`${styles.couponMessage} ${styles.couponError}`}>
            {couponError}
          </div>
        )}

        <div className={styles.summaryRow}>
          <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
          <span>{totalAmount.toFixed(2)} {language === "ar" ? "د.إ" : "AED"}</span>
        </div>
        {appliedCoupon && (
          <div className={styles.summaryRow} style={{ color: 'var(--brand-primary)' }}>
            <span>{language === "ar" ? "الخصم" : "Discount"}</span>
            <span>-{appliedCoupon.discountAmount.toFixed(2)} {language === "ar" ? "د.إ" : "AED"}</span>
          </div>
        )}
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span>{language === "ar" ? "الإجمالي قبل الشحن" : "Total Before Delivery"}</span>
          <span>{grandTotal.toFixed(2)} {language === "ar" ? "د.إ" : "AED"}</span>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,165,0,0.1)', color: '#b27300', borderRadius: '8px', fontSize: '13px', lineHeight: '1.5' }}>
          <strong>{language === 'ar' ? 'ملاحظة هامة:' : 'Important Note:'} </strong>
          {language === 'ar' 
            ? 'الأسعار لا تشمل تكلفة الشحن، وسيتم تحديد تكلفة الشحن وتأكيدها معك عبر واتساب.' 
            : 'Prices do not include delivery fees. Delivery fees will be confirmed with you via WhatsApp.'}
        </div>
      </section>

      <div className={styles.stickyFooter}>
        <button 
          className={styles.placeOrderBtn}
          onClick={handlePlaceOrder}
          disabled={!isFormValid || paymentMethod !== 'cash' || isPlacingOrder}
        >
          {isPlacingOrder ? (language === "ar" ? "جاري تجهيز طلبك..." : "Processing...") : (language === "ar" ? "إتمام الطلب عبر واتساب" : "Complete via WhatsApp")}
        </button>
      </div>
    </div>
  );
}
