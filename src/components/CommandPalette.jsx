import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { POSTS } from '../data/posts';

const ACTIONS = [
  { id: 'home', title: 'Home', shortcut: ['H'], section: 'Navigation', path: '/' },
  { id: 'blog', title: 'Blog', shortcut: ['B'], section: 'Navigation', path: '/blog' },
  { id: 'about', title: 'About Mission', shortcut: ['M'], section: 'Navigation', path: '/about' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const allSearchable = useMemo(() => {
    return [
      ...ACTIONS,
      ...POSTS.map(p => ({
        id: p.slug,
        title: p.title,
        section: 'Articles',
        path: `/blog/${p.slug}`,
        subtitle: p.excerpt.substring(0, 60) + '...',
      }))
    ];
  }, []);

  const filteredActions = useMemo(() => {
    if (!search.trim()) return allSearchable;
    const term = search.toLowerCase().trim();
    return allSearchable.filter(item => 
      item.title.toLowerCase().includes(term) ||
      (item.section && item.section.toLowerCase().includes(term)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(term))
    );
  }, [search, allSearchable]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSelect = useCallback((action) => {
    navigate(action.path);
    handleClose();
  }, [navigate, handleClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 10);
        }
      }
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'center',
      paddingTop: '15vh',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease'
    }} onClick={handleClose}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: T.surfaceHigh,
        borderRadius: '16px',
        border: `1px solid ${T.borderMid}`,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${T.border}` }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles or commands..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % filteredActions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
              } else if (e.key === 'Enter') {
                handleSelect(filteredActions[selectedIndex]);
              }
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: T.text,
              fontSize: '1.1rem',
              fontFamily: 'Poppins'
            }}
          />
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px 0' }}>
          {filteredActions.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: T.muted }}>
              No results found for "{search}"
            </div>
          ) : (
            filteredActions.map((action, i) => {
              const isSelected = i === selectedIndex;
              const showSection = i === 0 || filteredActions[i-1].section !== action.section;

              return (
                <div key={action.id}>
                  {showSection && (
                    <div style={{
                      padding: '12px 16px 4px 16px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: T.accent,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {action.section}
                    </div>
                  )}
                  <div
                    onClick={() => handleSelect(action)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(99,102,241,0.1)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: `3px solid ${isSelected ? T.accent : 'transparent'}`,
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <div>
                      <div style={{ color: T.text, fontWeight: 500, fontSize: '0.95rem' }}>{action.title}</div>
                      {action.subtitle && (
                        <div style={{ color: T.muted, fontSize: '0.8rem', marginTop: '2px' }}>{action.subtitle}</div>
                      )}
                    </div>
                    {action.shortcut && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {action.shortcut.map(key => (
                          <kbd key={key} style={{
                            background: T.surface,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            color: T.muted,
                            border: `1px solid ${T.borderMid}`,
                            fontFamily: 'sans-serif'
                          }}>{key}</kbd>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{
          padding: '12px 16px',
          background: T.faint,
          borderTop: `1px solid ${T.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '12px', color: T.muted, fontSize: '0.75rem' }}>
            <span><kbd style={kbdStyle}>↵</kbd> select</span>
            <span><kbd style={kbdStyle}>↑↓</kbd> navigate</span>
            <span><kbd style={kbdStyle}>esc</kbd> close</span>
          </div>
          <div style={{ color: T.accent, fontSize: '0.7rem', fontWeight: 600, fontFamily: 'Roboto Mono' }}>
            NULLPTR CMD
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { transform: translateY(20px) scale(0.98); opacity: 0; } 
          to { transform: translateY(0) scale(1); opacity: 1; } 
        }
      `}</style>
    </div>
  );
}

const kbdStyle = {
  background: 'rgba(0,0,0,0.1)',
  padding: '2px 4px',
  borderRadius: '4px',
  border: `1px solid ${T.borderMid}`,
  marginRight: '4px'
};
