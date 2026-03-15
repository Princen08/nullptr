import { useState, useEffect } from 'react';
import { T } from '../theme';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';

export default function BlogLayout({ children, title, subtitle, tags, date, readTime, progressColor = T.accent }) {
  const [scrollProgress, setScrollProgress] = useState(0);

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

      <article className="container fade-up" style={{ padding: '64px 24px 120px 24px', maxWidth: '800px' }}>
        <header style={{ marginBottom: '64px', borderBottom: `1px solid ${T.border}`, paddingBottom: '32px' }}>
          {tags && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {tags.map(t => (
                <span key={t} style={{ fontSize: '0.75rem', fontFamily: 'Roboto Mono', color: progressColor, background: `${progressColor}15`, padding: '4px 12px', borderRadius: '99px' }}>
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
                <div style={{ color: T.muted, fontSize: '0.8rem' }}>{date} • {readTime}</div>
             </div>
          </div>
        </header>

        {children}
      </article>
    </>
  );
}
