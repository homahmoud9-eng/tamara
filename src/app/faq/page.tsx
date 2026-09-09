"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import styles from './page.module.css';

export default function FAQPage() {
  const { language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const content = {
    ar: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إليك إجابات لأكثر الأسئلة التي تصلنا من عملائنا.',
      faqs: [
        {
          q: 'متى يتم توصيل الطلبات؟',
          a: 'نقوم بتوصيل جميع الطلبات بشكل يومي في الوقت المحدد الذي يتم الاتفاق عليه أثناء إتمام الطلب، لضمان وصول الطعام طازجاً وساخناً.'
        },
        {
          q: 'هل يمكنني تعديل مكونات الوجبة (مثل إزالة البصل أو تقليل الملح)؟',
          a: 'بالطبع! نحن نطبخ خصيصاً لك. يمكنك كتابة أي ملاحظات أو تفضيلات في خانة "ملاحظات الطلب" قبل الدفع وسنحرص على تنفيذها.'
        },
        {
          q: 'ما هي مناطق التوصيل المتاحة؟',
          a: 'نقوم بالتوصيل حالياً إلى جميع مناطق أبوظبي، ونعمل على التوسع قريباً لتغطية المزيد من المناطق.'
        },
        {
          q: 'كيف يمكنني دفع قيمة الطلب؟',
          a: 'نوفر عدة طرق للدفع لتسهيل تجربتك، بما في ذلك الدفع أونلاين عبر البطاقات الائتمانية، والدفع نقداً عند الاستلام.'
        },
        {
          q: 'هل الأكل مجهز مسبقاً أم يُطبخ يومياً؟',
          a: 'جميع أكلات مطبخ تمارا تُطبخ يومياً من الصفر باستخدام مكونات طازجة 100%، ولا نستخدم أي أطعمة مجمدة أو مجهزة مسبقاً.'
        },
        {
          q: 'كيف يمكنني الاشتراك في الباقات الأسبوعية أو الشهرية؟',
          a: 'يمكنك تصفح قسم "الباقات" في الموقع لاختيار الباقة التي تناسبك (أسبوعية أو شهرية)، ثم إضافتها للسلة وتحديد تواريخ التوصيل والوجبات المفضلة.'
        }
      ]
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Here are the answers to the most common questions from our customers.',
      faqs: [
        {
          q: 'When are orders delivered?',
          a: 'We deliver all orders daily at the scheduled time agreed upon during checkout, ensuring your food arrives fresh and hot.'
        },
        {
          q: 'Can I customize my meal (e.g., no onions, less salt)?',
          a: 'Absolutely! We cook just for you. You can leave any special requests or preferences in the "Order Notes" box before checking out.'
        },
        {
          q: 'What are your delivery areas?',
          a: 'Currently, we deliver to all areas within Abu Dhabi. We are working on expanding our reach very soon.'
        },
        {
          q: 'How can I pay for my order?',
          a: 'We offer multiple payment options including secure online credit card payments and cash on delivery.'
        },
        {
          q: 'Is the food pre-cooked or made fresh daily?',
          a: 'Everything at Tamara Kitchen is cooked daily from scratch using 100% fresh ingredients. We never use frozen or pre-prepared meals.'
        },
        {
          q: 'How do I subscribe to a weekly or monthly package?',
          a: 'You can visit the "Packages" section on our website, select the weekly or monthly plan that suits you, add it to your cart, and specify your preferred meals and delivery dates.'
        }
      ]
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.title}</h1>
      <p className={styles.subtitle}>{t.subtitle}</p>

      <div className={styles.faqList}>
        {t.faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
              <button 
                className={styles.faqQuestion} 
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
