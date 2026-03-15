import { Link } from 'react-router-dom';
import { T } from '../theme';

export default function PostCard({ slug, title, excerpt, date, readTime, tags, index = 0 }) {
  const post = { slug, title, excerpt, date, readTime, tags };
  return (
    <Link to={`/blog/${post.slug}`} className="fade-up" style={{
      display: 'block',
      background: T.surface,
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${T.border}`,
      transition: 'border-color 0.3s ease, background 0.3s ease',
      animationDelay: `${index * 0.1}s`,
      textDecoration: 'none'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = T.borderMid;
      e.currentTarget.style.background = T.surfaceHigh;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.background = T.surface;
    }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {post.tags?.map(t => (
          <span key={t} style={{
            fontSize: '0.75rem',
            fontFamily: 'Roboto Mono',
            color: T.accent,
            background: T.accentSoft,
            padding: '2px 8px',
            borderRadius: '99px'
          }}>
            {t}
          </span>
        ))}
      </div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: T.text }}>{post.title}</h3>
      <p style={{ color: T.muted, fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>{post.excerpt}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: T.muted, fontSize: '0.85rem' }}>
        <span>{post.date}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: T.accent }}>•</span> {post.readTime}
        </span>
      </div>
    </Link>
  );
}
