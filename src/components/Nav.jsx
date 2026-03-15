import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { T } from '../theme';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const loc = useLocation();
  const { user, loginWithGoogle, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
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
          {!isMobile && (
            <div style={{ display: 'flex', gap: '24px', marginRight: '8px' }}>
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
          )}

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

          {/* Auth Button/Profile */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  border: `2px solid ${T.border}`,
                  padding: 0,
                  background: 'none',
                  cursor: 'pointer'
                }}
              >
                <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
              
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '200px',
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  padding: '12px',
                  zIndex: 101,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ padding: '0 8px 8px 8px', borderBottom: `1px solid ${T.border}`, marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.user_metadata.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>
                  {isMobile && links.map(l => (
                    <Link key={l.path} to={l.path} onClick={() => setShowProfileMenu(false)} style={{ padding: '8px', borderRadius: '6px', fontSize: '0.9rem', color: T.text, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = T.faint} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{l.name}</Link>
                  ))}
                  <button onClick={() => { logout(); setShowProfileMenu(false); }} style={{ textAlign: 'left', padding: '8px', borderRadius: '6px', fontSize: '0.9rem', color: T.red, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = T.faint} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              style={{
                background: T.accent,
                color: '#fff',
                padding: isMobile ? '8px 12px' : '8px 20px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: `0 4px 12px ${T.accent}30`
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Log In
            </button>
          )}
        </div>
      </div>
      
      {/* Click outside to close menu handler */}
      {showProfileMenu && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 100 }} 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
}
