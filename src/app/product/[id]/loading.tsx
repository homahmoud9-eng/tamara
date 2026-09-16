export default function ProductLoading() {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ width: '100%', height: '300px', backgroundColor: 'var(--border-color)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }}></div>
      <div style={{ width: '60%', height: '32px', backgroundColor: 'var(--border-color)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
      <div style={{ width: '40%', height: '24px', backgroundColor: 'var(--border-color)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
      <div style={{ width: '100%', height: '80px', backgroundColor: 'var(--border-color)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
