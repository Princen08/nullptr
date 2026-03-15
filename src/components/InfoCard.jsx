import { T } from '../theme';

export default function InfoCard({ type = 'info', title, children }) {
  const typeColors = {
    info: T.blue,
    warning: T.amber,
    success: T.green,
    error: T.red,
    accent: T.accent
  };
  const color = typeColors[type] || T.accent;
  
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '8px',
      padding: '20px',
      margin: '24px 0'
    }}>
      {title && <h4 style={{ color, marginBottom: '8px', fontSize: '1rem', fontFamily: 'Poppins' }}>{title}</h4>}
      <div style={{ color: T.text, fontSize: '0.95rem', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}
