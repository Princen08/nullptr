import { T } from '../theme';

export default function Code({ children }) {
  return (
    <code style={{
      fontFamily: 'Roboto Mono',
      fontSize: '0.85em',
      color: T.accent,
      background: T.accentSoft,
      padding: '2px 6px',
      borderRadius: '4px'
    }}>
      {children}
    </code>
  );
}
