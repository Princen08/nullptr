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
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
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

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
