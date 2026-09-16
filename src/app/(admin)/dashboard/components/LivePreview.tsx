'use client';

import React from 'react';
import { ExternalLink, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface LivePreviewProps {
  url?: string;
  titleEn?: string;
  titleAr?: string;
  lang?: 'en' | 'ar';
}

export default function LivePreview({ url = '/', titleEn = 'Live Preview', titleAr = 'معاينة حية', lang = 'en' }: LivePreviewProps) {
  const [key, setKey] = React.useState(0);
  const [device, setDevice] = React.useState<'desktop' | 'mobile'>('desktop');

  const refreshPreview = () => setKey(prev => prev + 1);

  return (
    <div style={{
      border: '1px solid var(--admin-border)',
      borderRadius: 'var(--admin-radius)',
      background: 'var(--admin-card-bg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      position: 'sticky',
      top: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--admin-border)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, marginLeft: '8px', color: 'var(--admin-text)' }}>
            {lang === 'ar' ? titleAr : titleEn}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            onClick={() => setDevice('desktop')}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              color: device === 'desktop' ? 'var(--admin-primary)' : 'var(--admin-text-muted)'
            }}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button 
            type="button"
            onClick={() => setDevice('mobile')}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              color: device === 'mobile' ? 'var(--admin-primary)' : 'var(--admin-text-muted)'
            }}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
          <div style={{ width: '1px', height: '16px', background: 'var(--admin-border)', margin: '0 4px' }} />
          <button 
            type="button"
            onClick={refreshPreview}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)', padding: '4px' }}
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          <a 
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--admin-text-muted)', padding: '4px' }}
            title="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div style={{
        flex: 1,
        background: '#fff', // always white background for standard preview
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          width: device === 'desktop' ? '100%' : '375px',
          height: '100%',
          transition: 'width 0.3s ease',
          boxShadow: device === 'mobile' ? '0 0 20px rgba(0,0,0,0.1)' : 'none',
          borderLeft: device === 'mobile' ? '1px solid var(--admin-border)' : 'none',
          borderRight: device === 'mobile' ? '1px solid var(--admin-border)' : 'none',
        }}>
          <iframe 
            key={key}
            src={url} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
