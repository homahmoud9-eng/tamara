'use client';

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header/Header";
import { BottomNav } from "@/components/layout/BottomNav/BottomNav";
import { Footer } from "@/components/layout/Footer/Footer";
import { SplashScreen } from "@/components/layout/SplashScreen/SplashScreen";
import { AppInstallPrompt } from "@/components/ui/AppInstallPrompt/AppInstallPrompt";

export function ShopLayoutWrapper({ 
  children,
  announcement 
}: { 
  children: React.ReactNode;
  announcement?: any;
}) {
  const pathname = usePathname();
  
  // Exclude dashboard and login routes from shop layout
  const isShopRoute = !pathname?.startsWith('/dashboard') && !pathname?.startsWith('/login');

  if (!isShopRoute) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <SplashScreen />
      <Header announcement={announcement} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <AppInstallPrompt />
      <BottomNav />
    </div>
  );
}
