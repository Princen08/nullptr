import { useState, useEffect, useMemo } from 'react';
import { T } from '../theme';

export default function MemoryScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentAddress, setCurrentAddress] = useState('0x0000');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? scrollY / height : 0;
      setScrollProgress(progress);

      const addrHex = Math.floor(progress * 65535).toString(16).toUpperCase().padStart(4, '0');
      setCurrentAddress(`0x${addrHex}`);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const markers = useMemo(() => {
    const count = isMobile ? 20 : 40;
    return Array.from({ length: count }).map((_, i) => ({
      top: `${(i / (count - 1)) * 100}%`,
      isMajor: i % 5 === 0,
      label: !isMobile && i % 10 === 0 ? `0x${Math.floor((i / (count - 1)) * 65535).toString(16).toUpperCase().padStart(4, '0')}` : null
    }));
  }, [isMobile]);

  const specialPointers = [
    { name: 'POINTER', top: '15%', color: T.accent },
    { name: 'INTERRUPT', top: '45%', color: '#ef4444' },
    { name: 'STACK_BASE', top: '85%', color: T.purple },
  ];

  const width = isMobile ? '12px' : '60px';

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh',
      width: width,
      zIndex: 2000,
      background: T.navBg,
      borderLeft: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      pointerEvents: 'none',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      transition: 'width 0.3s ease'
    }}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {markers.map((m, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: m.top,
            right: 0,
            width: isMobile ? '4px' : (m.isMajor ? '15px' : '8px'),
            height: '1px',
            background: T.borderMid,
            display: 'flex',
            alignItems: 'center',
          }}>
            {m.label && (
              <span style={{
                position: 'absolute',
                right: '25px',
                fontSize: '0.6rem',
                fontFamily: 'Roboto Mono',
                color: T.muted,
                opacity: 0.5
              }}>{m.label}</span>
            )}
          </div>
        ))}

        {!isMobile && specialPointers.map(sp => (
          <div key={sp.name} style={{
            position: 'absolute',
            top: sp.top,
            left: 0,
            width: '100%',
            height: '1px',
            background: `${sp.color}30`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '4px'
          }}>
            <span style={{
              fontSize: '0.55rem',
              fontWeight: 800,
              fontFamily: 'Roboto Mono',
              color: sp.color,
              background: T.navBg,
              padding: '2px 4px',
              borderRadius: '2px',
              border: `1px solid ${sp.color}40`,
              letterSpacing: '0.5px'
            }}>
              {sp.name}
            </span>
          </div>
        ))}

        <div style={{
          position: 'absolute',
          top: `${scrollProgress * 100}%`,
          left: 0,
          width: '100%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'top 0.1s linear'
        }}>
          {!isMobile && (
            <div style={{
              background: T.accent,
              color: '#fff',
              fontFamily: 'Roboto Mono',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: '4px',
              boxShadow: `0 0 20px ${T.accent}40`,
              marginBottom: '4px'
            }}>
              {currentAddress}
            </div>
          )}
          
          <div style={{
            width: '100%',
            height: isMobile ? '20px' : '2px',
            background: T.accent,
            opacity: isMobile ? 0.6 : 1,
            boxShadow: `0 0 10px ${T.accent}`
          }} />
        </div>
      </div>

      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          textAlign: 'center',
          fontSize: '0.5rem',
          color: T.accent,
          fontFamily: 'Roboto Mono',
          opacity: 0.8,
          letterSpacing: '1px'
        }}>
          MEM_SCAN
        </div>
      )}
    </div>
  );
}
