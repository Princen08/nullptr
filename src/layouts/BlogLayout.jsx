import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { T } from '../theme';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';
import { supabaseApi } from '../lib/supabase';

export default function BlogLayout({ children, title, subtitle, tags, date, readTime, progressColor = T.accent }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const location = useLocation();
  const slug = location.pathname.split('/').pop() || 'index';

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch initial likes
    supabaseApi.getLikes(slug).then(({ data }) => {
      if (data) setLikes(data.count);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes(prev => prev + 1);
    await supabaseApi.incrementLike(slug);
  };

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

      <div style={{ position: 'fixed', left: '40px', top: '30%', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={handleLike}
          disabled={hasLiked}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'none', 
            border: 'none', 
            cursor: hasLiked ? 'default' : 'pointer',
            color: hasLiked ? T.accent : T.muted,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => !hasLiked && (e.currentTarget.style.color = T.accent)}
          onMouseLeave={e => !hasLiked && (e.currentTarget.style.color = T.muted)}
        >
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: T.surface, 
            border: `1px solid ${hasLiked ? T.accent : T.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hasLiked ? `0 0 15px ${T.accent}30` : 'none'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.74-8.74 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'Roboto Mono' }}>{likes}</span>
        </button>
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

      <style>{`
        @media (max-width: 1024px) {
          div[style*="position: fixed; left: 40px"] {
              display: none !important;
          }
        }
      `}</style>
    </>
  );
}
