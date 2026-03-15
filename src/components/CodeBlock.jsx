import { T } from '../theme';

export default function CodeBlock({ code, label }) {
  return (
    <div style={{
      background: '#080c18',
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      margin: '24px 0',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: T.red }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: T.amber }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: T.green }} />
        </div>
        {label && <div style={{
          marginLeft: 'auto',
          fontSize: '0.75rem',
          color: T.muted,
          fontFamily: 'Roboto Mono'
        }}>{label}</div>}
      </div>
      <div style={{ padding: '16px', overflowX: 'auto' }}>
        <pre style={{ margin: 0 }}>
          <code style={{
            fontFamily: 'Roboto Mono',
            fontSize: '12px',
            color: '#a0a8c0',
            lineHeight: 1.6
          }}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
