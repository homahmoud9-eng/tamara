'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { updateOrderStatus } from '../[id]/actions';

const COLUMNS = [
  { id: 'RECEIVED', labelAr: 'مستلم جديد', labelEn: 'New (Received)', icon: Clock, color: '#3b82f6', nextStatus: 'CONFIRMED' },
  { id: 'CONFIRMED', labelAr: 'مؤكد', labelEn: 'Confirmed', icon: CheckCircle, color: '#8b5cf6', nextStatus: 'PREPARING' },
  { id: 'PREPARING', labelAr: 'قيد التحضير', labelEn: 'Preparing (Kitchen)', icon: Package, color: '#f59e0b', nextStatus: 'OUT_FOR_DELIVERY' },
  { id: 'OUT_FOR_DELIVERY', labelAr: 'في الطريق', labelEn: 'Out for Delivery', icon: Truck, color: '#10b981', nextStatus: 'DELIVERED' },
];

export default function LiveOrdersClient({ initialOrders, lang }: { initialOrders: any[]; lang: string }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Poll for new orders every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh(); // This will re-fetch Server Component props
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  // Update local state when server props change
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setIsUpdating(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
      // Optimistic update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusTime = (createdAt: Date) => {
    const minutes = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / 60000);
    if (minutes < 1) return lang === 'ar' ? 'الآن' : 'Just now';
    return lang === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lang === 'ar' ? 'الطلبات الحية (لوحة المطبخ)' : 'Live Orders (Kitchen Board)'}
            <span style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '10px', 
              background: '#ef4444', 
              borderRadius: '50%',
              boxShadow: '0 0 10px #ef4444',
              animation: 'adminPulse 2s infinite'
            }}></span>
          </h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'يتم التحديث تلقائياً كل 10 ثوانٍ' : 'Auto-updates every 10 seconds'}</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px',
        flex: 1,
        overflow: 'hidden'
      }}>
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          const Icon = col.icon;
          
          return (
            <div key={col.id} style={{ 
              background: 'var(--admin-surface)', 
              borderRadius: 'var(--admin-radius-lg)', 
              border: `1px solid var(--admin-border)`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Column Header */}
              <div style={{ 
                padding: '16px', 
                borderBottom: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--admin-bg)',
                borderTop: `4px solid ${col.color}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <Icon size={18} color={col.color} />
                  {lang === 'ar' ? col.labelAr : col.labelEn}
                </div>
                <div style={{ 
                  background: 'var(--admin-border)', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: 600 
                }}>
                  {colOrders.length}
                </div>
              </div>

              {/* Column Body */}
              <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {colOrders.map(order => (
                  <div key={order.id} style={{ 
                    background: 'var(--admin-bg)', 
                    border: '1px solid var(--admin-border)', 
                    borderRadius: 'var(--admin-radius)',
                    padding: '12px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>#{order.orderNumber}</span>
                      <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {getStatusTime(order.createdAt)}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--admin-text)' }}>
                      {order.items.map((item: any, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600 }}>{item.quantity}x</span>
                          <span>{item.productNameAr}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--admin-border)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{order.total} SAR</span>
                      <button 
                        onClick={() => handleUpdateStatus(order.id, col.nextStatus)}
                        disabled={isUpdating === order.id}
                        style={{
                          background: col.color,
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 'var(--admin-radius-sm)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: isUpdating === order.id ? 0.5 : 1
                        }}
                      >
                        {isUpdating === order.id 
                          ? (lang === 'ar' ? 'جاري...' : 'Updating...') 
                          : (lang === 'ar' ? 'نقل للتالي' : 'Next Step')
                        }
                      </button>
                    </div>
                  </div>
                ))}

                {colOrders.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px', padding: '24px 0' }}>
                    {lang === 'ar' ? 'لا توجد طلبات هنا' : 'No orders here'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes adminPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  );
}
