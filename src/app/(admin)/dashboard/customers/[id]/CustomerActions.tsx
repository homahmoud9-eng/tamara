'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Ban, CheckCircle } from 'lucide-react';
import { deactivateCustomer, activateCustomer, deleteCustomer } from '../actions';

interface CustomerActionsProps {
  customerId: string;
  customerName: string;
  status: string;
  orderCount: number;
  lang: 'ar' | 'en';
}

export default function CustomerActions({ customerId, customerName, status, orderCount, lang }: CustomerActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'deactivate' | 'delete' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    setIsLoading(true);
    const res = await activateCustomer(customerId);
    setIsLoading(false);
    if (!res.success) {
      alert(res.error);
    }
  };

  const handleConfirmAction = async () => {
    if (!actionType) return;
    setIsLoading(true);
    setError(null);

    let res;
    if (actionType === 'deactivate') {
      res = await deactivateCustomer(customerId);
    } else if (actionType === 'delete') {
      res = await deleteCustomer(customerId);
    }

    setIsLoading(false);
    if (res?.success) {
      setShowModal(false);
      if (actionType === 'delete') {
        router.push('/dashboard/customers');
      }
    } else {
      setError(res?.error || 'Unknown error');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        {status === 'ACTIVE' ? (
          <button 
            className="admin-btn-secondary" 
            onClick={() => { setActionType('deactivate'); setShowModal(true); }}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Ban size={16} />
            {lang === 'ar' ? 'تعطيل الحساب' : 'Deactivate Account'}
          </button>
        ) : (
          <button 
            className="admin-btn-secondary" 
            onClick={handleActivate}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CheckCircle size={16} />
            {lang === 'ar' ? 'تفعيل الحساب' : 'Activate Account'}
          </button>
        )}
        
        {orderCount === 0 && (
          <button 
            className="admin-btn-danger" 
            onClick={() => { setActionType('delete'); setShowModal(true); }}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--admin-danger)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Trash2 size={16} />
            {lang === 'ar' ? 'حذف نهائي' : 'Delete Permanently'}
          </button>
        )}
      </div>

      {showModal && actionType && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--admin-bg)', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--admin-text)' }}>
              {actionType === 'delete' 
                ? (lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion')
                : (lang === 'ar' ? 'تأكيد التعطيل' : 'Confirm Deactivation')
              }
            </h3>
            
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              {actionType === 'delete' 
                ? (lang === 'ar' ? `هل أنت متأكد من حذف العميل "${customerName}" نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.` : `Are you sure you want to permanently delete customer "${customerName}"? This action cannot be undone.`)
                : (lang === 'ar' ? `هل أنت متأكد من تعطيل حساب العميل "${customerName}"؟ لن يتمكن من تسجيل الدخول.` : `Are you sure you want to deactivate customer "${customerName}"? They will not be able to login.`)
              }
            </p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="admin-btn-secondary" 
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                className="admin-btn-primary" 
                onClick={handleConfirmAction}
                disabled={isLoading}
                style={actionType === 'delete' ? { background: 'var(--admin-danger)', color: 'white', border: 'none' } : {}}
              >
                {isLoading 
                  ? (lang === 'ar' ? 'جاري التنفيذ...' : 'Processing...') 
                  : (actionType === 'delete' ? (lang === 'ar' ? 'حذف نهائي' : 'Delete') : (lang === 'ar' ? 'تعطيل' : 'Deactivate'))
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
