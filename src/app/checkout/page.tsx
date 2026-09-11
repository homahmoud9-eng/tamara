"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { useCart } from "@/components/providers/CartProvider";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { language } = useApp();
  const { items, totalAmount, orderNotes, clearCart } = useCart();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const deliveryFee = 15;
  const grandTotal = totalAmount + deliveryFee;

  const handlePlaceOrder = async () => {
    try {
      // 1. Send Order to Database
      const orderPayload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        address: formData.address,
        items: items,
        subtotal: totalAmount,
        deliveryFee: deliveryFee,
        totalAmount: grandTotal,
        customerNotes: orderNotes,
        paymentMethod: paymentMethod
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        console.error("Failed to save order to database.");
        // We will still send WhatsApp msg as fallback
      }

      // 2. Generate WhatsApp Message
      let msg = `*New Order - طلب جديد*\n`;
      msg += `Name: ${formData.name}\n`;
      msg += `Phone: ${formData.phone}\n`;
      msg += `Address: ${formData.address}\n\n`;
      msg += `*Items - الطلبات:*\n`;
      items.forEach(i => {
        const nameAr = i.name?.ar || 'منتج غير معروف';
        const nameEn = i.name?.en || 'Unknown Product';
        const variantAr = i.variantName?.ar ? ` - ${i.variantName.ar}` : '';
        const variantEn = i.variantName?.en ? ` - ${i.variantName.en}` : '';
        
        msg += `- ${i.quantity}x ${nameAr}${variantAr} | ${nameEn}${variantEn} (Total: ${i.totalPrice * i.quantity} AED)\n`;
        if (i.notes && i.notes.trim() !== '') {
          msg += `   Note - ملاحظة: ${i.notes}\n`;
        }
      });
      if (orderNotes && orderNotes.trim() !== '') {
        msg += `\n*Delivery Notes - ملاحظات التوصيل:* ${orderNotes}\n`;
      }
      msg += `\n*Delivery - التوصيل:* ${deliveryFee} AED\n`;
      msg += `*Grand Total - الإجمالي:* ${grandTotal} AED\n`;
      msg += `*Payment - الدفع:* ${paymentMethod === 'cash' ? 'Cash on Delivery - الدفع عند الاستلام' : 'Card - بطاقة'}`;

      const encodedMsg = encodeURIComponent(msg);
      // Open whatsapp in background
      window.open(`https://wa.me/971541744773?text=${encodedMsg}`, '_blank');

      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Error placing order:", err);
      alert(language === 'ar' ? 'حدث خطأ أثناء معالجة الطلب.' : 'Error processing order.');
    }
  };

  const isFormValid = formData.name.trim() !== "" && formData.phone.trim() !== "" && formData.address.trim() !== "";

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
            ? "شكراً لك. طلبك قيد التحضير وسنرسل لك تحديثات قريباً." 
            : "Thank you. Your order is being prepared and we'll send updates soon."}
        </p>
        <Link href="/orders/tracking-123" className={styles.trackBtn}>
          {language === "ar" ? "تتبع الطلب" : "Track Order"}
        </Link>
        <Link href="/" className={styles.whatsappBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {language === "ar" ? "تواصل معنا" : "Contact Us"}
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {language === "ar" ? "معلومات التوصيل" : "Delivery Details"}
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
        <div className={styles.inputGroup}>
          <label className={styles.label}>{language === "ar" ? "العنوان" : "Address"}</label>
          <textarea 
            className={styles.input} 
            rows={3}
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            placeholder={language === "ar" ? "أدخل عنوان التوصيل بالتفصيل" : "Enter detailed delivery address"}
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
          <div 
            className={`${styles.paymentCard} ${paymentMethod === 'card' ? styles.paymentCardActive : ''} ${styles.disabledCard}`}
          >
            <svg className={styles.paymentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <div>
              <div className={styles.paymentName}>{language === "ar" ? "بطاقة ائتمان" : "Credit Card"}</div>
              <div className={styles.paymentDesc} style={{ color: 'var(--color-error)' }}>
                {language === "ar" ? "متوفر قريباً" : "Coming Soon"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {language === "ar" ? "ملخص الطلب" : "Order Summary"}
        </h2>
        <div className={styles.summaryRow}>
          <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
          <span>{totalAmount} {language === "ar" ? "درهم" : "AED"}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>{language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
          <span>{deliveryFee} {language === "ar" ? "درهم" : "AED"}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span>{language === "ar" ? "الإجمالي" : "Grand Total"}</span>
          <span>{grandTotal} {language === "ar" ? "درهم" : "AED"}</span>
        </div>
      </section>

      <div className={styles.stickyFooter}>
        <button 
          className={styles.placeOrderBtn}
          onClick={handlePlaceOrder}
          disabled={!isFormValid || paymentMethod !== 'cash'}
        >
          {language === "ar" ? "تأكيد الطلب" : "Place Order"}
        </button>
      </div>
    </div>
  );
}
