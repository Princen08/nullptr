import { T } from '../theme';

export default function StatGrid({ stats }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
      margin: '32px 0'
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          padding: '20px 16px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: s.value.length > 8 ? '1.4rem' : '1.75rem', 
            fontWeight: 700, 
            fontFamily: 'Poppins, sans-serif', 
            color: T.text, 
            marginBottom: '4px',
            overflowWrap: 'break-word',
            lineHeight: 1.2
          }}>
            {s.value}
          </div>
          <div style={{ fontSize: '0.8rem', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
