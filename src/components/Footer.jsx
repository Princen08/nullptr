import { T } from '../theme';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: '80px 24px',
      marginTop: 'auto',
      background: T.surface,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`, opacity: 0.3 }} />
      
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '40px' 
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', letterSpacing: '-0.5px', color: T.text, display: 'block', marginBottom: '12px' }}>
            nullptr<span style={{ color: T.accent }}>_</span>
          </Link>
          <p style={{ color: T.muted, fontSize: '0.9rem', maxWidth: '300px', lineHeight: 1.6 }}>
            Dissecting the internals of modern software engineering. High-density technical deep dives for the curious.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: T.text, fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/blog" style={{ color: T.muted, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>Articles</Link>
              <Link to="/about" style={{ color: T.muted, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>Mission</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: T.text, fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Connect</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ color: T.muted, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>GitHub</a>
              <a href="#" style={{ color: T.muted, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>X / Twitter</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '64px', paddingTop: '32px', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <p style={{ color: T.muted, fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} NullPtr Engineering. All rights reserved.
        </p>
        <div style={{ color: T.muted, fontSize: '0.85rem', display: 'flex', gap: '24px' }}>
          <span style={{ color: T.accent, fontWeight: 700, fontFamily: 'Roboto Mono' }}>DEBUG_MODE: OFF</span>
          <span>v2.4.0</span>
        </div>
      </div>
    </footer>
  );
}
