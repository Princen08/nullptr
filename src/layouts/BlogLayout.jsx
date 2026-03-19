import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { T } from '../theme';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';
import { POSTS } from '../data/posts';

export default function BlogLayout({ children, title, subtitle, tags, date, readTime, progressColor = T.accent }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  const currentSlug = location.pathname.split('/').pop();

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEO 
        title={title} 
        description={subtitle} 
        article={true}
      />
      <div style={{ position: 'fixed', top: '80px', left: 0, right: 0, height: '3px', zIndex: 99 }}>
        <div style={{ width: `${scrollProgress}%`, height: '100%', background: progressColor, transition: 'width 0.1s' }} />
      </div>

      <div className="container" style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', padding: '64px 24px 120px 24px', maxWidth: '1200px' }}>
        <style>{`
          @media (max-width: 1024px) {
            .blog-sidebar {
              display: none !important;
            }
          }
        `}</style>
        
        {/* Sidebar Catalogue */}
        <aside className="blog-sidebar fade-up" style={{ position: 'sticky', top: '120px', width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: T.muted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Article Catalogue
          </div>
          {POSTS.filter(p => p.slug !== currentSlug).map(p => (
            <Link 
              key={p.slug} 
              to={`/blog/${p.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '20px',
                borderRadius: '12px',
                background: T.surfaceHigh,
                border: `1px solid ${T.border}`,
                textDecoration: 'none',
                transition: 'transform 0.2s, border-color 0.2s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '1rem', fontWeight: 800, color: T.text, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: '0.75rem', color: T.muted, fontFamily: 'Roboto Mono' }}>
                 {p.date} • {p.readTime}
              </div>
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <article className="fade-up" style={{ flex: 1, maxWidth: '800px', minWidth: 0 }}>
          <header style={{ marginBottom: '64px', borderBottom: `1px solid ${T.border}`, paddingBottom: '32px' }}>
            {tags && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {tags.map(t => (
                  <span key={t} style={{ fontSize: '0.75rem', fontFamily: 'Roboto Mono', color: progressColor, background: `${progressColor}15`, padding: '4px 12px', borderRadius: '99px', border: `1px solid ${progressColor}44` }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 style={{ fontSize: '3rem', fontFamily: 'Poppins', fontWeight: 800, color: T.text, lineHeight: 1.2, marginBottom: '24px' }}>
              <BinaryShadow>{title}</BinaryShadow>
            </h1>
            {subtitle && (
              <p style={{ fontSize: '1.25rem', color: T.muted, marginBottom: '32px', fontFamily: 'Poppins' }}>
                <BinaryShadow>{subtitle}</BinaryShadow>
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: T.surfaceHigh, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>N</div>
               <div style={{ color: T.text, fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 600 }}>NullPtr Team</div>
                  <div style={{ color: T.muted, fontSize: '0.8rem', fontFamily: 'Roboto Mono' }}>{date} • {readTime}</div>
               </div>
            </div>
          </header>

          {children}
        </article>
      </div>
    </>
  );
}
