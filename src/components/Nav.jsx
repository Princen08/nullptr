import { Link, useLocation } from 'react-router-dom';
import { T } from '../theme';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const loc = useLocation();
  
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      background: T.navBg,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${T.border}`,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Poppins', letterSpacing: '-0.5px', color: T.text }}>
          nullptr<span style={{ color: T.accent }}>_</span>
        </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {links.map(l => (
                <Link key={l.path} to={l.path} style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'Poppins',
                  color: loc.pathname === l.path ? T.text : T.muted,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.text}
                onMouseLeave={e => e.currentTarget.style.color = loc.pathname === l.path ? T.text : T.muted}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            <div style={{ width: '1px', height: '20px', background: T.border, margin: '0 8px' }} />

            <button 
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              style={{
                background: T.surface,
                border: `1px solid ${T.borderMid}`,
                borderRadius: '8px',
                padding: '6px 12px',
                color: T.muted,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <kbd style={{ 
                background: T.faint, 
                padding: '2px 4px', 
                borderRadius: '4px', 
                fontSize: '0.65rem',
                border: `1px solid ${T.borderMid}`,
                fontFamily: 'Inter, sans-serif'
              }}>⌘K</kbd>
            </button>

            <ThemeToggle />
          </div>
      </div>
    </nav>
  );
}
