import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { T } from '../theme';
import PostCard from '../components/PostCard';
import { POSTS, TOPICS } from '../data/posts';
import HeroBackground from '../animation/HeroBackground';
import SEO from '../components/SEO';

function resolveColor(colorVar) {
  if (!colorVar || !colorVar.startsWith('var')) return colorVar;
  const name = colorVar.slice(4, -1);
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgba(color, alpha) {
  const resolved = resolveColor(color);
  if (resolved.startsWith('rgba')) {
    return resolved.replace(/[\d.]+\)$/g, `${alpha})`);
  }
  if (resolved.startsWith('rgb')) {
    return resolved.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  if (resolved.startsWith('#')) {
    let r = parseInt(resolved.slice(1, 3), 16),
        g = parseInt(resolved.slice(3, 5), 16),
        b = parseInt(resolved.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return resolved;
}

export default function Home() {
  const featuredPosts = POSTS.filter(p => p.date !== 'Coming Soon').slice(0, 3);

  return (
    <div style={{ position: 'relative' }}>
      <SEO 
        title="Debug the Unseen" 
        description="A high-density technical publication exploring protocols, runtime engines, and distributed systems architecture." 
      />
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '160px 24px 120px 24px', 
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <HeroBackground />
        
        <div className="fade-up" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px 16px', 
          background: T.accentSoft, 
          borderRadius: '99px', 
          border: `1px solid ${hexToRgba(T.accent, 0.3)}`,
          marginBottom: '32px'
        }}>
          <span style={{ width: '6px', height: '6px', background: T.accent, borderRadius: '50%' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: T.accent, fontFamily: 'Roboto Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
            New Article: TLS 1.3 Deep Dive
          </span>
        </div>

        <h1 className="fade-up" style={{ 
          fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
          fontFamily: 'Poppins', 
          fontWeight: 900, 
          color: T.text, 
          lineHeight: 1, 
          marginBottom: '24px',
          letterSpacing: '-2px'
        }}>
          Debug the <br /> 
          <span style={{ 
            background: `linear-gradient(to right, ${T.accent}, #a78bfa)`, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>Unseen.</span>
        </h1>
        
        <p className="fade-up" style={{ 
          fontSize: '1.25rem', 
          color: T.muted, 
          maxWidth: '650px', 
          margin: '0 auto 48px auto', 
          fontFamily: 'Poppins',
          lineHeight: 1.6
        }}>
          A deep-tech engineering publication exploring the internals of protocols, runtime engines, and distributed systems.
        </p>
        
        <div className="fade-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/blog" style={{ 
            background: T.accent, 
            color: '#fff', 
            padding: '18px 40px', 
            borderRadius: '14px', 
            textDecoration: 'none', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            boxShadow: `0 20px 40px ${hexToRgba(T.accent, 0.2)}`,
            transition: 'transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Reading &rarr;
          </Link>
          <Link to="/about" style={{ 
            background: T.surface, 
            color: T.text, 
            padding: '18px 40px', 
            borderRadius: '14px', 
            textDecoration: 'none', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            border: `1px solid ${T.borderMid}`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = T.accent;
            e.currentTarget.style.background = T.accentSoft;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = T.borderMid;
            e.currentTarget.style.background = T.surface;
          }}
          >
            Mission
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="container" style={{ padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', fontFamily: 'Poppins', fontWeight: 800, color: T.text }}>Latest Internals</h2>
            <p style={{ color: T.muted, marginTop: '8px' }}>Our most recent technical dissections.</p>
          </div>
          <Link to="/blog" style={{ color: T.accent, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore Library &rarr;</Link>
        </div>
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {featuredPosts.map((post, i) => (
            <PostCard key={post.slug} {...post} index={i} />
          ))}
        </div>
      </section>

      {/* Topics / Tags - Refined */}
      <section style={{ 
        background: T.surface, 
        padding: '100px 24px', 
        borderTop: `1px solid ${T.border}`, 
        borderBottom: `1px solid ${T.border}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', background: `radial-gradient(circle at 10% 20%, ${hexToRgba(T.accent, 0.03)} 0%, transparent 40%)` }} />
        <div className="container" style={{ position: 'relative' }}>
          <h2 style={{ fontSize: '2.25rem', fontFamily: 'Poppins', fontWeight: 800, color: T.text, textAlign: 'center', marginBottom: '16px' }}>Filter by Domain</h2>
          <p style={{ color: T.muted, textAlign: 'center', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px auto' }}>Select a technical category to explore specific architectural patterns and implementations.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {TOPICS.map(topic => (
              <div key={topic} style={{ 
                background: T.bg, 
                border: `1px solid ${T.borderMid}`, 
                padding: '12px 28px', 
                borderRadius: '10px', 
                color: T.text, 
                fontWeight: 600, 
                fontSize: '1rem', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = T.accent;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 10px 20px ${hexToRgba(T.accent, 0.1)}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = T.borderMid;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Refined Glassmorphism */}
      <section className="container" style={{ padding: '120px 24px' }}>
        <div style={{ 
          background: `linear-gradient(135deg, ${T.surfaceHigh} 0%, ${T.bg} 100%)`, 
          borderRadius: '32px', 
          border: `1px solid ${T.borderMid}`, 
          padding: '80px 40px', 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{ position: 'absolute', top: '-10% ', right: '-10%', width: '400px', height: '400px', background: hexToRgba(T.accent, 0.07), borderRadius: '50%', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10% ', left: '-10%', width: '400px', height: '400px', background: hexToRgba(T.purple, 0.05), borderRadius: '50%', filter: 'blur(100px)' }} />
          
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: '3rem', fontFamily: 'Poppins', fontWeight: 900, color: T.text, marginBottom: '20px', letterSpacing: '-1px' }}>Build Better.</h2>
            <p style={{ color: T.muted, fontSize: '1.15rem', marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px auto', lineHeight: 1.6 }}>
              Join 12,000+ developers receiving monthly deep-dives into systems engineering. No spam, just technical rigor.
            </p>
            <form style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }} onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@company.com" 
                style={{ 
                  background: T.surface, 
                  border: `1px solid ${T.borderMid}`, 
                  borderRadius: '14px', 
                  padding: '18px 24px', 
                  color: T.text, 
                  flex: 1, 
                  minWidth: '280px', 
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }} 
                onFocus={e => e.currentTarget.style.borderColor = T.accent}
                onBlur={e => e.currentTarget.style.borderColor = T.borderMid}
              />
              <button style={{ 
                background: T.text, 
                color: T.bg, 
                padding: '18px 40px', 
                borderRadius: '14px', 
                border: 'none', 
                fontWeight: 800, 
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Join Publication
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
