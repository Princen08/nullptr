import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { T } from '../theme';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const loc = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      paddingRight: 'var(--scrollbar-width, 60px)',
      transition: 'padding-right 0.3s ease'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 24px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          fontSize: isMobile ? '1.1rem' : '1.25rem', 
          fontWeight: 800, 
          fontFamily: 'Poppins', 
          letterSpacing: '-0.5px', 
          color: T.text,
          flexShrink: 0 
        }}>
          nullptr<span style={{ color: T.accent }}>_</span>
        </Link>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
          
          {/* Main Links */}
          <div style={{ display: 'flex', gap: isMobile ? '16px' : '24px' }}>
            {links.map(l => (
              <Link key={l.path} to={l.path} style={{
                fontSize: isMobile ? '0.85rem' : '0.95rem',
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

          {!isMobile && <div style={{ width: '1px', height: '20px', background: T.border, margin: '0 8px' }} />}

          {/* Search Button */}
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            style={{
              background: T.surface,
              border: `1px solid ${T.borderMid}`,
              borderRadius: '8px',
              padding: isMobile ? '8px' : '6px 12px',
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
            {!isMobile && (
              <kbd style={{ 
                background: T.faint, 
                padding: '2px 4px', 
                borderRadius: '4px', 
                fontSize: '0.65rem',
                border: `1px solid ${T.borderMid}`,
                fontFamily: 'Inter, sans-serif'
              }}>⌘K</kbd>
            )}
          </button>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
