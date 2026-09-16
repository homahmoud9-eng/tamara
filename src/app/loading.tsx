export default function GlobalLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%', flexDirection: 'column', gap: '16px' }}>
      <div className="spinner" style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid var(--border-color)', 
        borderTop: '4px solid var(--color-primary)', 
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
