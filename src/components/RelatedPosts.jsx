import { Link } from 'react-router-dom';
import { T } from '../theme';
import { POSTS } from '../data/posts';

export default function RelatedPosts({ currentSlug }) {
  const related = POSTS.filter(p => p.slug !== currentSlug && p.date !== 'Coming Soon').slice(0, 2);

  return (
    <footer className="container fade-up" style={{ paddingBottom: '120px', maxWidth: '800px' }}>
      <div style={{ paddingTop: '48px', borderTop: `1px solid ${T.border}` }}>
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, color: T.text, marginBottom: '24px' }}>More Articles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {related.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} style={{ display: 'block', background: T.surface, padding: '24px', borderRadius: '12px', border: `1px solid ${T.border}`, textDecoration: 'none' }}>
              <div style={{ color: T.accent, fontSize: '0.8rem', fontFamily: 'Roboto Mono', marginBottom: '8px' }}>{p.tags[0]}</div>
              <div style={{ color: T.text, fontFamily: 'Poppins', fontWeight: 600, fontSize: '1.2rem', marginBottom: '8px' }}>{p.title}</div>
              <div style={{ color: T.muted, fontSize: '0.9rem' }}>Read article &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
