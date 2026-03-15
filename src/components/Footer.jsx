import { useState } from 'react';
import { T } from '../theme';
import { Link } from 'react-router-dom';
import { supabaseApi } from '../lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    const { error } = await supabaseApi.subscribe(email);
    
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: '80px 24px',
      marginTop: 'auto',
      background: T.surface,
      position: 'relative',
      overflow: 'hidden',
      paddingRight: 'var(--scrollbar-width, 60px)'
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`, opacity: 0.3 }} />
      
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        gap: '64px' 
      }}>
        {/* Brand & Subscribe */}
        <div style={{ flex: '1.5', minWidth: '300px' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', letterSpacing: '-0.5px', color: T.text, display: 'block', marginBottom: '12px' }}>
            nullptr<span style={{ color: T.accent }}>_</span>
          </Link>
          <p style={{ color: T.muted, fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
            Dissecting the internals of modern software engineering. High-density technical deep dives for the curious.
          </p>

          <div style={{ maxWidth: '400px' }}>
            <h4 style={{ color: T.text, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Subscribe to the Debugger</h4>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="engineer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: T.bg,
                  border: `1px solid ${T.borderMid}`,
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: T.text,
                  fontFamily: 'Roboto Mono, monospace',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background: status === 'success' ? T.green : T.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 20px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {status === 'loading' ? '...' : status === 'success' ? 'Joined!' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && <p style={{ color: T.red, fontSize: '0.75rem', marginTop: '8px' }}>Failed to subscribe. Please try again.</p>}
            <p style={{ color: T.muted, fontSize: '0.75rem', marginTop: '12px', fontStyle: 'italic' }}>Join 2,400+ engineers. No spam, just deep tech.</p>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
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
