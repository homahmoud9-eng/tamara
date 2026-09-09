'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Users, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Tag,
  Radio
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

interface NotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  type: 'promo' | 'order' | 'system' | 'general';
  target: 'all' | 'active' | 'inactive' | 'vip';
  status: 'sent' | 'scheduled' | 'draft';
  recipientsCount: number;
  openRate: string;
  sentAt: string;
  url?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    titleAr: 'عشاء الليلة أشهى مع تمارا! 🔥',
    titleEn: 'Dinner is tastier tonight with Tamara! 🔥',
    bodyAr: 'احصل على خصم 25% على جميع بوكسات الشاورما عند الطلب قبل الساعة 10 مساءً. استخدم كود: DINNER25',
    bodyEn: 'Get 25% off all Shawarma boxes when ordering before 10 PM. Use code: DINNER25',
    type: 'promo',
    target: 'all',
    status: 'sent',
    recipientsCount: 3420,
    openRate: '48.2%',
    sentAt: 'اليوم، 06:30 م',
    url: '/offers'
  },
  {
    id: 'notif-2',
    titleAr: 'طلبك خرج من المطبخ وفي الطريق إليك 🛵',
    titleEn: 'Your order left the kitchen and is on the way 🛵',
    bodyAr: 'السائق قادم إليك، يمكنك تتبع موقعه في الوقت الفعلي عبر الخريطة.',
    bodyEn: 'The driver is heading to you, track live location on map.',
    type: 'order',
    target: 'active',
    status: 'sent',
    recipientsCount: 158,
    openRate: '89.4%',
    sentAt: 'اليوم، 02:15 م',
    url: '/orders'
  },
  {
    id: 'notif-3',
    titleAr: 'اشتقنا لك! وجبتك المفضلة بانتظارك 🎁',
    titleEn: 'We missed you! Your favorite meal is waiting 🎁',
    bodyAr: 'توصيل مجاني لطلبك القادم عند استخدام الكود: WE_MISS_YOU',
    bodyEn: 'Free delivery on your next order with code: WE_MISS_YOU',
    type: 'promo',
    target: 'inactive',
    status: 'scheduled',
    recipientsCount: 850,
    openRate: '—',
    sentAt: 'غداً، 01:00 م',
    url: '/menu'
  },
  {
    id: 'notif-4',
    titleAr: 'تحديث أوقات العمل في فرع دبي ⏱️',
    titleEn: 'Updated opening hours for Dubai branch ⏱️',
    bodyAr: 'يسرنا استقبالكم حتى الساعة 2:00 صباحاً طوال عطلة نهاية الأسبوع.',
    bodyEn: 'We are pleased to welcome you until 2:00 AM on weekends.',
    type: 'system',
    target: 'all',
    status: 'sent',
    recipientsCount: 2900,
    openRate: '41.0%',
    sentAt: 'أمس، 08:00 م',
    url: '/contact'
  }
];

export default function AdminNotificationsPage() {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'promo' | 'order' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    bodyAr: '',
    bodyEn: '',
    type: 'promo' as 'promo' | 'order' | 'system' | 'general',
    target: 'all' as 'all' | 'active' | 'inactive' | 'vip',
    url: '/offers',
    timing: 'now' as 'now' | 'scheduled',
    scheduledTime: ''
  });

  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' ? true : n.type === activeTab;
    const matchesSearch = 
      n.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.bodyAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.bodyEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr || !formData.bodyAr) return;

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleAr: formData.titleAr,
      titleEn: formData.titleEn || formData.titleAr,
      bodyAr: formData.bodyAr,
      bodyEn: formData.bodyEn || formData.bodyAr,
      type: formData.type,
      target: formData.target,
      status: formData.timing === 'scheduled' ? 'scheduled' : 'sent',
      recipientsCount: formData.target === 'all' ? 3850 : formData.target === 'vip' ? 320 : 1200,
      openRate: formData.timing === 'scheduled' ? '—' : '0.0%',
      sentAt: formData.timing === 'scheduled' ? (formData.scheduledTime || (isAr ? 'مجدول لاحقاً' : 'Scheduled')) : (isAr ? 'الآن' : 'Just now'),
      url: formData.url
    };

    setNotifications([newNotif, ...notifications]);
    setIsCreating(false);
    setSuccessToast(isAr ? 'تم إرسال الإشعار بنجاح إلى جميع الأجهزة المستهدفة!' : 'Notification sent successfully to target devices!');
    
    // Reset form
    setFormData({
      titleAr: '',
      titleEn: '',
      bodyAr: '',
      bodyEn: '',
      type: 'promo',
      target: 'all',
      url: '/offers',
      timing: 'now',
      scheduledTime: ''
    });

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div style={{ padding: '0 4px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast message */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: isAr ? 'auto' : '20px',
          left: isAr ? '20px' : 'auto',
          zIndex: 9999,
          backgroundColor: '#10B981',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} />
          {successToast}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 700 }}>
            <Bell style={{ color: 'var(--admin-primary)' }} size={28} />
            {isAr ? 'إشعارات التطبيق والويب (Push Notifications)' : 'App & Web Push Notifications'}
          </h1>
          <p className="admin-page-subtitle" style={{ color: 'var(--admin-text-muted)', marginTop: '4px' }}>
            {isAr ? 'إدارة وبث الإشعارات الفورية والمجدولة لعملاء مطبخ تمارا' : 'Manage and broadcast instant and scheduled push notifications to customers'}
          </p>
        </div>

        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="admin-btn-primary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {isCreating ? <ChevronRight size={18} /> : <Plus size={18} />}
          {isCreating 
            ? (isAr ? 'إغلاق النموذج' : 'Close Form') 
            : (isAr ? 'إنشاء إشعار جديد' : 'Broadcast New Notification')}
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{
          backgroundColor: 'var(--admin-surface)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(23, 63, 53, 0.08)',
            color: 'var(--admin-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Send size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
              {isAr ? 'إجمالي الإشعارات المرسلة' : 'Total Sent'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px' }}>
              {notifications.filter(n => n.status === 'sent').length * 1248 + 120}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--admin-surface)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
              {isAr ? 'نسبة التسليم الناجح' : 'Delivery Rate'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px', color: '#10B981' }}>
              99.4%
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--admin-surface)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
              {isAr ? 'متوسط نسبة الفتح' : 'Avg. Open Rate'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px' }}>
              52.8%
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--admin-surface)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Smartphone size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
              {isAr ? 'المشتركون في الإشعارات' : 'Push Subscribers'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px' }}>
              3,820
            </div>
          </div>
        </div>
      </div>

      {/* Creation Box with Mobile Live Preview */}
      {isCreating && (
        <div style={{
          backgroundColor: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--admin-accent)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              {isAr ? 'إنشاء وبث إشعار فوري جديد' : 'Compose & Broadcast Push Notification'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* Form Column */}
            <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'عنوان الإشعار (بالعربية) *' : 'Notification Title (Arabic) *'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="مثال: خصم 20% على شاورما تمارا! 🌯"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: 'var(--admin-text)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'عنوان الإشعار (بالإنجليزية)' : 'Notification Title (English)'}
                  </label>
                  <input 
                    type="text"
                    value={formData.titleEn}
                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. 20% off on Tamara Shawarma! 🌯"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: 'var(--admin-text)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                  {isAr ? 'نص الإشعار (بالعربية) *' : 'Notification Body (Arabic) *'}
                </label>
                <textarea 
                  required
                  rows={3}
                  value={formData.bodyAr}
                  onChange={e => setFormData({ ...formData, bodyAr: e.target.value })}
                  placeholder="اكتب نص الإشعار الجذاب هنا..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--admin-bg)',
                    color: 'var(--admin-text)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                  {isAr ? 'نص الإشعار (بالإنجليزية)' : 'Notification Body (English)'}
                </label>
                <textarea 
                  rows={2}
                  value={formData.bodyEn}
                  onChange={e => setFormData({ ...formData, bodyEn: e.target.value })}
                  placeholder="Notification message body in English..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--admin-bg)',
                    color: 'var(--admin-text)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'نوع الإشعار' : 'Type'}
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: 'var(--admin-text)'
                    }}
                  >
                    <option value="promo">{isAr ? '🎁 عرض ترويجي / خصم' : '🎁 Promotional / Offer'}</option>
                    <option value="order">{isAr ? '🛵 حالة طلب' : '🛵 Order Status'}</option>
                    <option value="system">{isAr ? '⚙️ تنبيه من النظام' : '⚙️ System Alert'}</option>
                    <option value="general">{isAr ? '📢 إعلان عام' : '📢 General Announcement'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'الجمهور المستهدف' : 'Target Audience'}
                  </label>
                  <select
                    value={formData.target}
                    onChange={e => setFormData({ ...formData, target: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: 'var(--admin-text)'
                    }}
                  >
                    <option value="all">{isAr ? 'جميع العملاء (3,820 عميل)' : 'All Customers (3,820 users)'}</option>
                    <option value="active">{isAr ? 'العملاء النشطين هذا الأسبوع' : 'Active This Week'}</option>
                    <option value="inactive">{isAr ? 'عملاء لم يطلبوا منذ 30 يوماً' : 'Inactive (30+ days)'}</option>
                    <option value="vip">{isAr ? 'عملاء VIP (أكثر من 5 طلبات)' : 'VIP Customers (5+ orders)'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'الرابط عند الضغط' : 'Action Link on Click'}
                  </label>
                  <select
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: 'var(--admin-text)'
                    }}
                  >
                    <option value="/offers">{isAr ? 'صفحة العروض (/offers)' : 'Offers page (/offers)'}</option>
                    <option value="/menu">{isAr ? 'المنيو وقائمة الطعام (/menu)' : 'Menu page (/menu)'}</option>
                    <option value="/orders">{isAr ? 'تتبع الطلب (/orders)' : 'Orders page (/orders)'}</option>
                    <option value="/">{isAr ? 'الصفحة الرئيسية (/)' : 'Homepage (/)'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'توقيت الإرسال' : 'Delivery Timing'}
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      <input 
                        type="radio" 
                        name="timing" 
                        checked={formData.timing === 'now'}
                        onChange={() => setFormData({ ...formData, timing: 'now' })}
                      />
                      {isAr ? 'فوري (الآن)' : 'Immediate'}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      <input 
                        type="radio" 
                        name="timing" 
                        checked={formData.timing === 'scheduled'}
                        onChange={() => setFormData({ ...formData, timing: 'scheduled' })}
                      />
                      {isAr ? 'جدولة لاحقاً' : 'Schedule'}
                    </label>
                  </div>
                </div>
              </div>

              {formData.timing === 'scheduled' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>
                    {isAr ? 'موعد وتاريخ الإرسال' : 'Scheduled Date & Time'}
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: 'var(--admin-text)'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <Send size={18} />
                  {formData.timing === 'scheduled' 
                    ? (isAr ? 'جدولة الإشعار' : 'Schedule Notification') 
                    : (isAr ? 'إرسال وبث الآن' : 'Broadcast Now')}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    backgroundColor: 'transparent',
                    color: 'var(--admin-text)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>

            {/* Live Mobile Device Preview */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--admin-bg)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px dashed var(--admin-border)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isAr ? 'معاينة حية على الهاتف (Mobile Push Preview)' : 'Live Mobile Push Preview'}
              </div>

              {/* Phone Frame */}
              <div style={{
                width: '300px',
                backgroundColor: '#1E293B',
                borderRadius: '32px',
                padding: '14px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '4px solid #334155',
                position: 'relative'
              }}>
                {/* Notch */}
                <div style={{
                  width: '90px',
                  height: '14px',
                  backgroundColor: '#0F172A',
                  borderRadius: '0 0 10px 10px',
                  margin: '0 auto 16px auto'
                }} />

                {/* Lock Screen Notification Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  color: '#0F172A',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  direction: isAr ? 'rtl' : 'ltr'
                }}>
                  {/* App Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        backgroundColor: '#173F35',
                        color: '#F7F0E3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 800
                      }}>
                        TK
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#173F35' }}>
                        TAMARA KITCHEN
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>
                      {isAr ? 'الآن' : 'now'}
                    </span>
                  </div>

                  {/* Notification Content */}
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px', color: '#0F172A' }}>
                    {isAr ? (formData.titleAr || 'عنوان الإشعار يظهر هنا...') : (formData.titleEn || formData.titleAr || 'Notification title goes here...')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                    {isAr ? (formData.bodyAr || 'تفاصيل ونص الإشعار الترويجي ستظهر للمستخدم بهذا الشكل.') : (formData.bodyEn || formData.bodyAr || 'The push notification message preview will appear like this.')}
                  </div>
                </div>

                <div style={{
                  marginTop: '40px',
                  textAlign: 'center',
                  fontSize: '11px',
                  color: '#94A3B8'
                }}>
                  {isAr ? 'اسحب لفتح العرض ↗' : 'Slide to open offer ↗'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: 'var(--admin-surface)',
        border: '1px solid var(--admin-border)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'all' ? 'var(--admin-primary)' : 'var(--admin-surface-hover)',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--admin-text-secondary)'
            }}
          >
            {isAr ? 'الكل' : 'All'} ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'promo' ? 'var(--admin-primary)' : 'var(--admin-surface-hover)',
              color: activeTab === 'promo' ? '#FFFFFF' : 'var(--admin-text-secondary)'
            }}
          >
            {isAr ? '🎁 عروض وترويج' : '🎁 Promos'}
          </button>
          <button
            onClick={() => setActiveTab('order')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'order' ? 'var(--admin-primary)' : 'var(--admin-surface-hover)',
              color: activeTab === 'order' ? '#FFFFFF' : 'var(--admin-text-secondary)'
            }}
          >
            {isAr ? '🛵 حالات الطلبات' : '🛵 Orders'}
          </button>
          <button
            onClick={() => setActiveTab('system')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'system' ? 'var(--admin-primary)' : 'var(--admin-surface-hover)',
              color: activeTab === 'system' ? '#FFFFFF' : 'var(--admin-text-secondary)'
            }}
          >
            {isAr ? '⚙️ تنبيهات النظام' : '⚙️ System'}
          </button>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--admin-bg)',
          border: '1px solid var(--admin-border)',
          borderRadius: '8px',
          padding: '6px 12px',
          minWidth: '240px'
        }}>
          <Search size={16} color="var(--admin-text-muted)" />
          <input 
            type="text"
            placeholder={isAr ? 'بحث في الإشعارات...' : 'Search notifications...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--admin-text)',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Notifications Table */}
      <div className="admin-table-container" style={{ backgroundColor: 'var(--admin-surface)', borderRadius: '12px', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border)', textAlign: isAr ? 'right' : 'left' }}>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                {isAr ? 'الإشعار' : 'Notification'}
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                {isAr ? 'النوع' : 'Type'}
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                {isAr ? 'الجمهور' : 'Target'}
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                {isAr ? 'المستلمون' : 'Audience'}
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                {isAr ? 'نسبة الفتح' : 'Open Rate'}
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                {isAr ? 'التوقيت / الحالة' : 'Status & Time'}
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '13px', textAlign: 'center' }}>
                {isAr ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-text-muted)' }}>
                  <AlertCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <div>{isAr ? 'لا توجد إشعارات مطابقة' : 'No notifications found'}</div>
                </td>
              </tr>
            ) : (
              filteredNotifications.map(notif => (
                <tr key={notif.id} style={{ borderBottom: '1px solid var(--admin-border-light)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text)', marginBottom: '4px', fontSize: '14px' }}>
                      {isAr ? notif.titleAr : notif.titleEn}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', maxWidth: '380px', lineHeight: 1.4 }}>
                      {isAr ? notif.bodyAr : notif.bodyEn}
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    {notif.type === 'promo' && (
                      <span className="admin-badge" style={{ backgroundColor: 'rgba(23, 63, 53, 0.1)', color: 'var(--admin-primary)', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
                        {isAr ? '🎁 ترويجي' : '🎁 Promo'}
                      </span>
                    )}
                    {notif.type === 'order' && (
                      <span className="admin-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
                        {isAr ? '🛵 طلب' : '🛵 Order'}
                      </span>
                    )}
                    {notif.type === 'system' && (
                      <span className="admin-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
                        {isAr ? '⚙️ نظام' : '⚙️ System'}
                      </span>
                    )}
                    {notif.type === 'general' && (
                      <span className="admin-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
                        {isAr ? '📢 عام' : '📢 General'}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '16px', fontSize: '13px' }}>
                    {notif.target === 'all' && (isAr ? 'الجميع' : 'All Users')}
                    {notif.target === 'active' && (isAr ? 'النشطين' : 'Active Users')}
                    {notif.target === 'inactive' && (isAr ? 'غير النشطين' : 'Inactive')}
                    {notif.target === 'vip' && (isAr ? 'عملاء VIP' : 'VIP')}
                  </td>

                  <td style={{ padding: '16px', fontWeight: 600, fontSize: '13px' }}>
                    {notif.recipientsCount.toLocaleString()}
                  </td>

                  <td style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: notif.openRate !== '—' ? '#10B981' : 'var(--admin-text-muted)' }}>
                    {notif.openRate}
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      {notif.status === 'sent' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '12px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} />
                          {isAr ? 'تم الإرسال' : 'Sent'}
                        </span>
                      )}
                      {notif.status === 'scheduled' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '12px', fontWeight: 600 }}>
                          <Clock size={14} />
                          {isAr ? 'مجدول' : 'Scheduled'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                      {notif.sentAt}
                    </div>
                  </td>

                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      title={isAr ? 'حذف الإشعار' : 'Delete notification'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--admin-error, #EF4444)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
