'use client';
import Link from 'next/link';
import { Search, Bell, User, Languages } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';
import { getUnreadCount } from '../notifications/actions';
import { useEffect, useState } from 'react';

export default function Header() {
  const { language, setLanguage } = useApp();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (e) {
        console.error('Failed to fetch unread count:', e);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

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
          href="/dashboard/notifications" 
          className="admin-icon-btn"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'inherit' }}
          title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -2,
              right: -4,
              backgroundColor: 'var(--admin-accent, #B85C38)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
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
