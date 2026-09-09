'use client';
import Link from 'next/link';
import { Search, Bell, User, Languages } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

export default function Header() {
  const { language, setLanguage } = useApp();

  return (
    <header className="admin-header">
      <div className="admin-search">
        <Search size={18} color="var(--admin-text-muted)" />
        <input 
          type="text" 
          placeholder={language === 'ar' ? "ابحث عن طلبات، عملاء، منتجات..." : "Search orders, customers, products..."}
        />
      </div>

      <div className="admin-header-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button 
          className="admin-icon-btn" 
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500 }}
        >
          <Languages size={20} />
          {language === 'ar' ? 'EN' : 'عربي'}
        </button>
        <Link 
          href="/dashboard/app/notifications" 
          className="admin-icon-btn"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'inherit' }}
          title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 8,
            height: 8,
            backgroundColor: 'var(--admin-accent, #B85C38)',
            borderRadius: '50%'
          }} />
        </Link>
        <div className="admin-user-avatar" style={{ 
          width: '36px', height: '36px', borderRadius: '50%', 
          backgroundColor: 'var(--admin-primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
