import { T } from '../theme';

export default function MiniFlowDiagram({ nodes }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: T.surfaceHigh,
      padding: '24px',
      borderRadius: '12px',
      margin: '32px 0',
      overflowX: 'auto',
      border: `1px solid ${T.border}`
    }}>
      {nodes.map((n, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
          <div style={{
            padding: '8px 16px',
            background: T.faint,
            border: `1px solid ${T.borderMid}`,
            borderRadius: '99px',
            fontSize: '0.85rem',
            fontFamily: 'Roboto Mono',
            color: T.accent
          }}>
            {n}
          </div>
          {i < nodes.length - 1 && (
            <div style={{
              width: '32px',
              height: '2px',
              background: T.borderMid,
              margin: '0 8px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '-4px',
                top: '-3px',
                width: '0',
                height: '0',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderLeft: `6px solid ${T.borderMid}`
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
