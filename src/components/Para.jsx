import { T } from '../theme';

export default function Para({ children }) {
  return (
    <p style={{
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.85,
      color: T.text,
      marginBottom: '20px'
    }}>
      {children}
    </p>
  );
}
