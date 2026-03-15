import { T } from '../theme';

export default function SectionHeading({ title, tag }) {
  return (
    <div style={{ margin: '48px 0 24px 0' }}>
      {tag && (
        <div style={{
          fontSize: '0.75rem',
          fontFamily: 'Roboto Mono',
          color: T.accent,
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {tag}
        </div>
      )}
      <h2 style={{
        fontFamily: 'Poppins',
        fontWeight: 700,
        fontSize: '1.75rem',
        color: T.text,
        lineHeight: 1.3
      }}>
        {title}
      </h2>
    </div>
  );
}
