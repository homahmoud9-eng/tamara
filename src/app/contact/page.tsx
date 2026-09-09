"use client";

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import styles from './page.module.css';

export default function ContactPage() {
  const { language } = useApp();
  const isAr = language === 'ar';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isAr ? "تواصل معنا" : "Contact Us"}</h1>
        <p className={styles.description}>{isAr ? "نحن هنا للإجابة على جميع استفساراتك وتلبية طلباتك" : "We are here to answer all your inquiries and fulfill your requests"}</p>
      </div>
      
      <div className={`container ${styles.content}`}>
        <div className={styles.contactGrid}>
          
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <Phone className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>{isAr ? "اتصل بنا" : "Call Us"}</h3>
            <p className={styles.cardText}>{isAr ? "متاحين يومياً لخدمتكم" : "Available daily to serve you"}</p>
            <a href="tel:+971541744773" className={styles.cardLink} dir="ltr">+971 54 174 4773</a>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <MessageSquare className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>{isAr ? "واتساب" : "WhatsApp"}</h3>
            <p className={styles.cardText}>{isAr ? "تواصل معنا عبر واتساب للمساعدة السريعة" : "Contact us via WhatsApp for quick help"}</p>
            <a href="https://wa.me/971541744773" target="_blank" rel="noopener noreferrer" className={styles.cardLink} dir="ltr">+971 54 174 4773</a>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <Mail className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>{isAr ? "البريد الإلكتروني" : "Email"}</h3>
            <p className={styles.cardText}>{isAr ? "للشكاوى والاقتراحات" : "For complaints and suggestions"}</p>
            <a href="mailto:info@tamarakitchen.com" className={styles.cardLink}>info@tamarakitchen.com</a>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <MapPin className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>{isAr ? "العنوان" : "Address"}</h3>
            <p className={styles.cardText}>{isAr ? "أبوظبي، الإمارات العربية المتحدة" : "Abu Dhabi, UAE"}</p>
          </div>

        </div>

        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2>{isAr ? "أرسل لنا رسالة" : "Send us a message"}</h2>
            <p>{isAr ? "قم بملء النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن" : "Fill out the form below and we will get back to you as soon as possible"}</p>
          </div>
          <form className={styles.contactForm}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>{isAr ? "الاسم" : "Name"}</label>
                <input type="text" placeholder={isAr ? "أدخل اسمك" : "Enter your name"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label>{isAr ? "رقم الهاتف" : "Phone Number"}</label>
                <input type="tel" placeholder={isAr ? "أدخل رقم هاتفك" : "Enter your phone"} className={styles.input} dir="ltr" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{isAr ? "الرسالة" : "Message"}</label>
              <textarea placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."} className={styles.textarea} rows={5}></textarea>
            </div>
            <button type="button" className={styles.submitBtn}>
              {isAr ? "إرسال الرسالة" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
