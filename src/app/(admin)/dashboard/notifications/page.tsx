'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { Bell, ShoppingBag, User, Settings, Check, Trash2 } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from './actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { language } = useApp();
  const isArabic = language === 'ar';
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Lightweight polling every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
    router.refresh();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
    router.refresh();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag size={20} color="var(--admin-accent)" />;
      case 'CUSTOMER': return <User size={20} color="var(--admin-primary)" />;
      default: return <Bell size={20} />;
    }
  };

  const getLink = (type: string, entityId: string | null) => {
    if (!entityId) return '#';
    switch (type) {
      case 'ORDER': return `/dashboard/orders/${entityId}`;
      case 'CUSTOMER': return `/dashboard/customers/${entityId}`;
      default: return '#';
    }
  };

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">{isArabic ? 'الإشعارات' : 'Notifications'}</h1>
          </div>
        </div>
        <div className="admin-card" style={{ padding: '24px', textAlign: 'center' }}>
          <p>{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
            {isArabic ? 'الإشعارات' : 'Notifications'}
            {unreadCount > 0 && (
              <span style={{ 
                background: 'var(--admin-accent)', color: 'white', padding: '2px 8px', 
                borderRadius: '12px', fontSize: '12px', margin: '0 8px', verticalAlign: 'middle'
              }}>
                {unreadCount} {isArabic ? 'جديد' : 'New'}
              </span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="admin-btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Check size={16} /> {isArabic ? 'تحديد الكل كمقروء' : 'Mark all as read'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty-state">
              <p className="admin-empty-state-title">{isArabic ? 'لا توجد إشعارات جديدة' : 'No new notifications'}</p>
            </div>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="admin-card" style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', 
              borderLeft: notif.isRead ? '4px solid transparent' : '4px solid var(--admin-accent)',
              backgroundColor: notif.isRead ? 'var(--admin-bg-primary)' : 'rgba(184, 92, 56, 0.05)'
            }}>
              <div style={{ padding: '10px', background: 'var(--admin-bg-secondary)', borderRadius: '50%' }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1 }}>
                <Link href={getLink(notif.type, notif.entityId)} onClick={() => !notif.isRead && handleMarkAsRead(notif.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontWeight: notif.isRead ? 400 : 600, fontSize: '15px' }}>
                    {isArabic ? notif.titleAr : notif.titleEn}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                    {isArabic ? notif.messageAr : notif.messageEn}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '8px' }}>
                    {new Date(notif.createdAt).toLocaleString(isArabic ? 'ar-EG' : 'en-US')}
                  </div>
                </Link>
              </div>
              {!notif.isRead && (
                <button onClick={() => handleMarkAsRead(notif.id)} className="admin-icon-btn" title={isArabic ? 'تحديد كمقروء' : 'Mark as read'}>
                  <Check size={18} color="var(--admin-accent)" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
