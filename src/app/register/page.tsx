"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useApp } from "@/components/providers/AppProvider";
import styles from "../login/login.module.css"; // Reuse login styles

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto login after successful registration
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError(language === "ar" ? "حدث خطأ أثناء تسجيل الدخول التلقائي" : "Error during auto-login");
        setLoading(false);
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/account" });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>{language === "ar" ? "إنشاء حساب جديد" : "Create Account"}</h1>
        <p className={styles.subtitle}>{language === "ar" ? "انضم إلى عائلة تمارا الآن" : "Join Tamara family now"}</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>{language === "ar" ? "الاسم" : "Name"}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder={language === "ar" ? "أحمد محمد" : "John Doe"}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>{language === "ar" ? "رقم الهاتف" : "Phone"}</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
              placeholder="+971 50 000 0000"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>{language === "ar" ? "البريد الإلكتروني" : "Email"}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="example@email.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>{language === "ar" ? "كلمة المرور" : "Password"}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (language === "ar" ? "جاري إنشاء الحساب..." : "Creating...") : (language === "ar" ? "إنشاء حساب" : "Sign Up")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{language === "ar" ? "أو" : "OR"}</span>
        </div>

        <button type="button" onClick={handleGoogleLogin} className={styles.googleBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {language === "ar" ? "المتابعة باستخدام جوجل" : "Continue with Google"}
        </button>

        <p className={styles.registerLink}>
          {language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link href="/login">
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
