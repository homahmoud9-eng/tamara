'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import Image from 'next/image';

import '../admin.css';

const initialState = { error: '', success: false };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div dir="ltr" className="admin-login-wrapper">
      <div className="admin-login-card">
        
        <div className="admin-login-logo">
          <div className="admin-login-icon">
             <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TK</span>
          </div>
        </div>
        
        <h2 className="admin-login-title">
          Tamara Mother Dashboard
        </h2>
        <p className="admin-login-subtitle">Sign in to manage your ecosystem</p>

        <form action={formAction}>
          {state?.error && (
            <div className="admin-error-message">
              {state.error}
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="admin-form-input"
              placeholder="admin@tamara.com"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="admin-form-input"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={pending}
            className="admin-btn-primary"
          >
            {pending ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}
