'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'action'> {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  successMessage?: string;
  successMessageAr?: string;
  errorMessage?: string;
  errorMessageAr?: string;
  redirectUrl?: string;
  lang: 'ar' | 'en';
  submitText?: string;
  submitTextAr?: string;
  submittingText?: string;
  submittingTextAr?: string;
}

export default function AdminForm({
  action,
  children,
  successMessage = 'Saved successfully',
  successMessageAr = 'تم الحفظ بنجاح',
  errorMessage = 'An error occurred while saving. Please check your data and try again.',
  errorMessageAr = 'تعذر الحفظ. راجع البيانات وحاول مرة أخرى.',
  redirectUrl,
  lang,
  submitText = 'Save',
  submitTextAr = 'حفظ',
  submittingText = 'Saving...',
  submittingTextAr = 'جاري الحفظ...',
  ...props
}: AdminFormProps) {
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'SUBMITTING') return;
    
    setStatus('SUBMITTING');
    setErrorMsg('');
    
    try {
      const formData = new FormData(e.currentTarget);
      const res = await action(formData);
      
      if (res && res.error) {
        setStatus('ERROR');
        setErrorMsg(res.error);
        return;
      }
      
      setStatus('SUCCESS');
      if (redirectUrl) {
        // Redirect after a short delay to allow the user to see the success message
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      setStatus('ERROR');
      setErrorMsg(`Client Exception: ${err.message || String(err)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" {...props}>
      {status === 'ERROR' && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', border: '1px solid #f87171' }}>
          {errorMsg || (lang === 'ar' ? errorMessageAr : errorMessage)}
        </div>
      )}
      {status === 'SUCCESS' && (
        <div className="admin-alert admin-alert-success" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#dcfce3', color: '#166534', borderRadius: '4px', border: '1px solid #4ade80' }}>
          {lang === 'ar' ? successMessageAr : successMessage}
        </div>
      )}
      
      {children}
      
      <div className="admin-form-actions" style={{ marginTop: '24px' }}>
        <button type="submit" className="admin-btn-primary" disabled={status === 'SUBMITTING'}>
          {status === 'SUBMITTING' 
            ? (lang === 'ar' ? submittingTextAr : submittingText)
            : (lang === 'ar' ? submitTextAr : submitText)}
        </button>
      </div>
    </form>
  );
}
