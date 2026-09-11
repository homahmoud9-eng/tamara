import type { Metadata } from "next";
import Script from "next/script";
import { ShopLayoutWrapper } from "@/components/layout/ShopLayoutWrapper/ShopLayoutWrapper";
import { AppProvider } from "@/components/providers/AppProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground/AnimatedBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamara Kitchen | مطبخ تمارا",
  description: "طعم البيت المصري، أقرب مما تتخيل. أكل مصري بيتعمل بطعم البيت ويتوصل طازة في أبوظبي.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#173f35",
};

import { prisma } from "@/lib/prisma";

import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcement = await prisma.announcementBar.findUnique({ where: { id: '1' } });

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              let theme = localStorage.getItem('theme');
              if (!theme) {
                theme = 'system';
              }
              if (theme === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
              } else {
                document.documentElement.setAttribute('data-theme', theme);
              }
              
              let lang = localStorage.getItem('language');
              if (lang) {
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
              } else if (navigator.language.startsWith('en')) {
                document.documentElement.lang = 'en';
                document.documentElement.dir = 'ltr';
              }
            } catch (e) {}

            // Register Service Worker for PWA
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
        <NextAuthProvider>
          <AppProvider>
          <CartProvider>
            <FavoritesProvider>
              <AnimatedBackground />
              <ShopLayoutWrapper announcement={announcement}>
                {children}
              </ShopLayoutWrapper>
            </FavoritesProvider>
          </CartProvider>
          </AppProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
